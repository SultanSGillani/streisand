# -*- coding: utf-8 -*-

from django.db.utils import IntegrityError
from django.utils import timezone
from rest_framework import serializers

from api.exceptions import AlreadyExistsException
from releases.models import Release
from torrent_requests.models import TorrentRequest
from torrent_stats.models import TorrentStats
from torrents.models import TorrentFile, ReseedRequest

from ..releases.serializers import ReleaseSerializer
from ..users.serializers import DisplayUserSerializer


class TorrentStatSerializer(serializers.ModelSerializer):

    user = DisplayUserSerializer(read_only=True)

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
            'seed_time_remaining',
            'ratio',
            'hnr_countdown_started_at',
            'is_hit_and_run',
        )
        read_only_fields = fields


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


class ReseedRequestSerializer(serializers.ModelSerializer):
    created_by = DisplayUserSerializer(read_only=True)
    fulfilled_at = serializers.DateTimeField(default_timezone=timezone.get_current_timezone(), required=False)

    class Meta:
        model = ReseedRequest
        fields = ('id', 'torrent', 'created_by', 'created_at', 'fulfilled_at')

    def create(self, validated_data):
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)


class TorrentFileSerializer(serializers.ModelSerializer):
    release_id = serializers.PrimaryKeyRelatedField(
        source='release',
        write_only=True,
        allow_null=True,
        required=False,
        queryset=Release.objects.all(),
    )
    release = ReleaseSerializer(required=False, read_only=True)
    uploaded_by = DisplayUserSerializer(read_only=True)
    created_by = serializers.CharField(write_only=True, required=False)
    pieces = serializers.CharField(write_only=True)
    info_hash = serializers.CharField(read_only=True)
    total_size_in_bytes = serializers.IntegerField(read_only=True)
    download_url = serializers.SerializerMethodField(read_only=True)
    reseed_request = ReseedRequestSerializer(read_only=True, required=False)

    class Meta:
        model = TorrentFile
        fields = (
            'id',
            'info_hash',
            'download_url',
            'release',
            'release_id',
            'total_size_in_bytes',
            'piece_size_in_bytes',
            'pieces',
            'created_by',
            'uploaded_by',
            'uploaded_at',
            'last_seeded',
            'snatch_count',
            'reseed_request',
            'is_accepting_reseed_requests',
            'is_approved',
            'moderated_by',
            'is_single_file',
            'directory_name',
            'file',
            'files',
        )

    def get_download_url(self, torrent):
        request = self.context['request']
        return torrent.download_url_for_user(request.user)

    @staticmethod
    def enforce_extension_blacklist(file_name):
        blacklisted_extensions = ('.txt', '.exe', '.rar')
        if file_name.endswith(blacklisted_extensions):
            raise serializers.ValidationError(
                'Your torrent may not contain files with the following '
                'extensions: {blacklist}'.format(blacklist=blacklisted_extensions)
            )

    def validate_file(self, file):
        if file:
            self.enforce_extension_blacklist(file['name'])
            return file

    def validate_files(self, files):
        if files:
            for file in files:
                self.enforce_extension_blacklist(file['path_components'][-1])
            return files

    def create(self, validated_data):

        validated_data['uploaded_by'] = self.context['request'].user

        try:
            return super().create(validated_data)
        except IntegrityError:
            raise AlreadyExistsException("A torrent with this info hash already exists.")
