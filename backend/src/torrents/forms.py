# -*- coding: utf-8 -*-

from django import forms
from django.core.exceptions import ValidationError
from django.db import transaction

from tracker.bencoding import bdecode, BencodeError, info_hash_from_metainfo_dict
from tracker.models import Swarm

from .models import Torrent, TorrentMetaInfo


class TorrentUploadForm(forms.ModelForm):

    EXT_BLACKLIST = ('.txt', '.exe')
    METADATA_KEY_WHITELIST = {
        'info',
        'creation date',
        'created by',
        'comment',
        'encoding',
    }

    torrent_file = forms.FileField()

    class Meta:
        model = Torrent
        fields = (
            'torrent_file',
            'film',
            'cut',
            'release_name',
            'release_group',
            'is_scene',
            'is_3d',
            'is_source',
            'source_media',
            'resolution',
            'codec',
            'container',
        )

    def __init__(self, *args, **kwargs):
        uploader = kwargs.pop('uploader')
        super().__init__(*args, **kwargs)
        self.instance.uploaded_by = uploader
        self.metainfo_dict = None

    def clean_torrent_file(self):

        torrent_file = self.cleaned_data['torrent_file']

        if not torrent_file.name.endswith('.torrent'):
            raise ValidationError('This is not a valid torrent file')

        try:
            metainfo_dict = bdecode(torrent_file.read())
        except BencodeError:
            raise ValidationError('This is not a valid torrent file')

        try:
            private = (metainfo_dict['info']['private'] == 1)
        except KeyError:
            private = False
        if not private:
            raise ValidationError('This torrent is not marked private')

        self.metainfo_dict = self._scrub_metainfo(metainfo_dict)
        self.instance.size_in_bytes = self._get_size()
        self.instance.file_list = self._get_file_list()

        return torrent_file

    def _scrub_metainfo(self, metainfo_dict):

        # Make sure the private flag is set
        metainfo_dict['info']['private'] = 1

        # Only save whitelisted fields
        return {
            k: v
            for (k, v)
            in metainfo_dict.items()
            if k in self.METADATA_KEY_WHITELIST
        }

    def _get_size(self):
        size_in_bytes = sum(
            [
                file['length']
                for file
                in self.metainfo_dict['info']['files']
            ]
        )
        if size_in_bytes == 0:
            raise ValidationError('This torrent contains no files, or the files are empty')
        return size_in_bytes

    def _get_file_list(self):
        if 'files' in self.metainfo_dict['info']:
            file_list = [
                '/'.join(file['path'])
                for file
                in self.metainfo_dict['info']['files']
            ]
        else:
            file_list = [
                self.metainfo_dict['info']['name']
            ]
        for name in file_list:
            if name.endswith(self.EXT_BLACKLIST):
                raise ValidationError(
                    'Your torrent may not contain files with the following '
                    'extensions: {blacklist}'.format(blacklist=self.EXT_BLACKLIST)
                )
        return file_list

    def save(self, *args, **kwargs):

        info_hash = info_hash_from_metainfo_dict(self.metainfo_dict)

        with transaction.atomic():
            self.instance.swarm = Swarm.objects.create(torrent_info_hash=info_hash)
            self.instance.metainfo = TorrentMetaInfo.objects.create(dictionary=self.metainfo_dict)
            return super().save(*args, **kwargs)
