# -*- coding: utf-8 -*-

from django.template.defaultfilters import filesizeformat
from rest_framework import serializers
from rest_framework.validators import UniqueTogetherValidator

from mediainfo.serializers import AdminMediainfoSerializer
from torrent_requests.models import TorrentRequest
from torrent_stats.models import TorrentStats
from torrents.models import TorrentComment, TorrentFile

from ..users.serializers import DisplayUserProfileSerializer

# from mediainfo.models import Mediainfo


class AdminTorrentSerializer(serializers.ModelSerializer):
    size = serializers.SerializerMethodField()
    mediainfo = AdminMediainfoSerializer(source='release.mediainfo')
    film_id = serializers.PrimaryKeyRelatedField(source='release.film_id', read_only=True)
    cut = serializers.CharField(source='release.cut')
    format = serializers.CharField(source='release.format')
    codec = serializers.CharField(source='release.codec_id')
    container = serializers.CharField(source='release.container_id')
    resolution = serializers.CharField(source='release.resolution_id')
    source_media = serializers.CharField(source='release.source_media_id')
    is_source = serializers.BooleanField(source='release.is_source')
    is_scene = serializers.BooleanField(source='release.is_scene')
    is_3d = serializers.BooleanField(source='release.is_3d')
    release_name = serializers.CharField(source='release.name')
    release_group = serializers.CharField(source='release.group')
    nfo = serializers.CharField(source='release.nfo')
    description = serializers.CharField(source='release.description')

    class Meta:
        model = TorrentFile
        fields = (
            'id',
            'info_hash',
            'film_id',
            'cut',
            'codec',
            'container',
            'resolution',
            'source_media',
            'is_source',
            'is_3d',
            'size',
            'format',
            'uploaded_by',
            'uploaded_at',
            'last_seeded',
            'snatch_count',
            'reseed_request',
            'is_accepting_reseed_requests',
            'is_approved',
            'moderated_by',
            'release_name',
            'release_group',
            'is_scene',
            'is_single_file',
            'directory_name',
            'file',
            'files',
            'nfo',
            'mediainfo',
            'description',
            'comments',
        )

    @staticmethod
    def get_size(torrent):
        return filesizeformat(torrent.total_size_in_bytes)

    @staticmethod
    def get_piece_size(torrent):
        return filesizeformat(torrent.piece_size_in_bytes)

    @staticmethod
    def get_file_list(torrent):
        if torrent.is_single_file:
            return [torrent.file]
        else:
            return torrent.files


class TorrentStatSerializer(serializers.ModelSerializer):
    class Meta:
        model = TorrentStats
        fields = (
            'user',
            'torrent',
            'bytes_uploaded',
            'bytes_downloaded',
            'first_snatched',
            'last_snatched',
            'snatch_count',
            'last_seeded',
            'seed_time',
            'ratio',
            'hnr_countdown_started_at',
            'is_hit_and_run',
        )
        validators = [
            UniqueTogetherValidator(
                queryset=TorrentStats.objects.all(),
                fields=('user', 'torrent')
            )
        ]


class TorrentRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = TorrentRequest
        fields = (
            'id',
            'film_title',
            'film_year',
            'description',
            'release_name',
            'requester_followed_through',
            'is_source',
            'created_by',
            'format',
            'imdb',
            'filling_torrent',
            'source_media',
            'resolution',
            'codec',
            'container'
        )

    # TODO: Getting key error for text. make this torrent serializer updatable. Currently cannot due to
    # Key error with Media Info Serializer as a nested unwritable serializer.
    """
    def create(self, validated_data):
        mediainfo_data = validated_data.pop('mediainfo')
        torrent = Torrent.objects.create(**validated_data)

        for mediainfo in mediainfo_data:
            mediainfo, created = Mediainfo.objects.get_or_create(text=mediainfo['text'])
            torrent.mediainfo.add(mediainfo)
        return torrent

    def update(self, instance, validated_data):
        mediainfo_data = validated_data.pop('mediainfo')
        instance.text = validated_data['text']
        instance.runtime = validated_data['runtime']
        instance.resolution_width = validated_data['resolution_width']
        instance.resolution_height = validated_data['resolution_height']
        instance.display_aspect_ratio = validated_data['display_aspect_ratio']
        instance.bit_rate = validated_data['bit_rate']
        instance.frame_rate = validated_data['frame_rate']
        instance.has_chapters = validated_data['has_chapters']
        instance.is_dxva_compliant = validated_data['is_dxva_compliant']
        instance.is_quality_encode = validated_data['is_quality_encode']

        for mediainfo in mediainfo_data:
            mediainfo, created = Mediainfo.objects.update_or_create(text=mediainfo['text'])
            instance.mediainfo.add(mediainfo)
        return instance
    """


class PublicTorrentSerializer(AdminTorrentSerializer):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        remove_fields = (
            'moderated_by',
        )
        for field_name in remove_fields:
            self.fields.pop(field_name)


class TorrentUploadSerializer(serializers.ModelSerializer):

    EXT_BLACKLIST = ('.txt', '.exe', '.rar')
    uploaded_by = DisplayUserProfileSerializer(default=serializers.CurrentUserDefault())
    pieces = serializers.CharField(write_only=True)
    info_hash = serializers.CharField(read_only=True)
    download_url = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = TorrentFile
        fields = (
            'download_url',
            'uploaded_by',
            'created_by',
            'is_single_file',
            'file',
            'directory_name',
            'files',
            'pieces',
            'piece_size_in_bytes',
            'info_hash',
        )

    def validate_file(self, file):
        if file['name'].endswith(self.EXT_BLACKLIST):
            raise serializers.ValidationError(
                'Your torrent may not contain files with the following '
                'extensions: {blacklist}'.format(blacklist=self.EXT_BLACKLIST)
            )
        return file

    def validate_files(self, files):
        for file in files:
            if file['path_components'][-1].endswith(self.EXT_BLACKLIST):
                raise serializers.ValidationError(
                    'Your torrent may not contain files with the following '
                    'extensions: {blacklist}'.format(blacklist=self.EXT_BLACKLIST)
                )
        return files

    def get_download_url(self, torrent):
        return torrent.download_url_for_user(user=self.request.user)


class TorrentCommentSerializer(serializers.ModelSerializer):
    """
    Serializer for Torrent Comments. Author is the users foreign key to Torrent comments.
    We are returning the author into a foreign key representation, and string representation.
    """
    film_id = serializers.PrimaryKeyRelatedField(source='torrent.film', read_only=True)
    torrent_name = serializers.StringRelatedField(
        source='torrent.release.name',
        read_only=True,
        help_text="Read only field that shows the torrent release name."
    )
    author = serializers.PrimaryKeyRelatedField(
        default=serializers.CurrentUserDefault(),
        read_only=True,
        help_text="The ID of the user that created this film comment; if none is provided, "
                  "defaults to the currently logged in user."
    )
    author_username = serializers.StringRelatedField(
        source='author', default=serializers.CurrentUserDefault(),
        read_only=True,
        help_text="The string representation of the user that created this film comment; if none is provided, "
                  "defaults to the currently logged in user."
    )
    url = serializers.HyperlinkedRelatedField(source='torrent', view_name='torrent-detail', read_only=True)

    class Meta:
        model = TorrentComment
        fields = (
            'torrent',
            'torrent_name',
            'url',
            'film_id',
            'author',
            'author_username',
            'text',
            'created_at',
            'modified_at'
        )
