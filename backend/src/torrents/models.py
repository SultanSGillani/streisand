# -*- coding: utf-8 -*-

from binascii import a2b_base64, b2a_hex

from django.contrib.postgres.fields import JSONField
from django.db import models
from django.urls import reverse
from django.utils.timezone import now, timedelta

from tracker.bencoding import bencode, sha1
from users.models import User

from .utils import generate_unique_download_key


class TorrentFile(models.Model):

    # File information
    info_hash = models.CharField(max_length=40, unique=True)
    created_by = models.CharField(null=True, max_length=128)
    is_single_file = models.BooleanField()
    file = JSONField(null=True)
    files = JSONField(null=True)
    directory_name = models.CharField(null=True, max_length=512)
    total_size_in_bytes = models.BigIntegerField(null=False)
    piece_size_in_bytes = models.BigIntegerField(null=False)
    pieces = models.TextField(null=False, help_text="base64 encoded binary pieces data")

    # Site information
    release = models.ForeignKey(
        to='releases.Release',
        related_name='torrents',
        null=True,
        on_delete=models.PROTECT,
    )
    uploaded_at = models.DateTimeField(auto_now_add=True)
    uploaded_by = models.ForeignKey(
        to='users.User',
        null=False,
        related_name='uploaded_torrents',
        on_delete=models.PROTECT,
    )
    moderated_by = models.ForeignKey(
        to='users.User',
        null=True,
        blank=True,
        related_name='moderated_torrents',
        on_delete=models.PROTECT,
    )
    is_approved = models.NullBooleanField(
        choices=(
            (None, 'Not Yet Moderated'),
            (True, 'Approved'),
            (False, 'Work In Progress'),
        )
    )
    last_seeded = models.DateTimeField(null=True)
    reseed_request = models.OneToOneField(
        to='torrents.ReseedRequest',
        null=True,
        related_name='active_on_torrent',
        on_delete=models.SET_NULL,
    )
    snatch_count = models.IntegerField(default=0)

    class Meta:
        permissions = (
            ('can_upload', "Can upload new torrents"),
            ('can_moderate', "Can moderate torrents"),
            ('can_request_reseed', "Can request a reseed"),
        )

    def __str__(self):
        return str(self.info_hash)

    def save(self, *args, **kwargs):

        if not self.pk:

            # Calculate info hash
            self.info_hash = self.get_info_hash(self.get_info_dict())

            # Calculate total size
            if self.is_single_file:
                self.total_size_in_bytes = self.file['size_in_bytes']
            else:
                self.total_size_in_bytes = sum(
                    file['size_in_bytes']
                    for file in self.files
                )

        super().save(*args, **kwargs)

    def download_url_for_user(self, user):

        unique_download_key = generate_unique_download_key(
            torrent_info_hash=self.info_hash,
            user_download_key=user.torrent_download_key_id,
        )

        return reverse(
            viewname='torrent_download',
            kwargs={
                'user_id': user.id,
                'torrent_id': self.id,
                'unique_download_key': unique_download_key,
            }
        )

    @property
    def file_name_for_download(self):
        if hasattr(self, 'torrent'):
            return self.release.name
        else:
            return self.info_hash

    @staticmethod
    def get_info_hash(info_dict):
        return b2a_hex(sha1(bencode(info_dict))).decode('utf-8')

    def get_info_dict(self):

        info_dict = {
            'private': 1,
            'source': 'JumpCut',
            'piece length': self.piece_size_in_bytes,
            'pieces': a2b_base64(self.pieces),
        }

        if self.is_single_file:

            info_dict['name'] = self.file['name']
            info_dict['length'] = self.file['size_in_bytes']

        else:

            info_dict['name'] = self.directory_name
            info_dict['files'] = [
                {
                    'length': file['size_in_bytes'],
                    'path': file['path_components'],
                }
                for file in self.files
            ]

        return info_dict

    def get_metainfo_dict(self, user):

        metainfo_dict = {
            'announce': user.announce_url,
            'creation date': int(self.uploaded_at.timestamp()),
            'comment': self.file_name_for_download,
            'info': self.get_info_dict(),
        }

        if self.created_by:
            metainfo_dict['created by'] = self.created_by

        return metainfo_dict

    def for_user_download(self, user):

        metainfo_dict = self.get_metainfo_dict(user)
        assert self.info_hash == self.get_info_hash(metainfo_dict['info'])
        return bencode(metainfo_dict)

    @property
    def is_accepting_reseed_requests(self):
        one_day_ago = now() - timedelta(days=1)
        one_week_ago = now() - timedelta(days=7)
        return all((
            self.uploaded_at < one_day_ago,
            self.last_seeded is None or self.last_seeded < one_day_ago,
            self.reseed_request is None or self.reseed_request.created_at < one_week_ago,
        ))

    @property
    def seeders(self):
        return User.objects.filter(
            announce_key__in=self.swarm.peers.seeders().values_list('user_announce_key', flat=True)
        )

    def request_reseed(self, user):
        self.reseed_request = self.reseed_requests.create(
            created_by=user,
        )
        self.save(update_fields=['reseed_request'])


class ReseedRequest(models.Model):

    # TODO: notify the torrent's uploader and the snatch list when one of these is created

    torrent = models.ForeignKey(
        to='torrents.TorrentFile',
        related_name='reseed_requests',
        on_delete=models.CASCADE,
        null=True,
    )
    created_by = models.ForeignKey(
        to='users.User',
        related_name='reseed_requests',
        null=True,
        on_delete=models.CASCADE,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    fulfilled_at = models.DateTimeField(null=True)
