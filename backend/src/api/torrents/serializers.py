# -*- coding: utf-8 -*-

from rest_framework import serializers

from django.template.defaultfilters import filesizeformat

from mediainfo.serializers import AdminMediainfoSerializer

from torrents.models import Torrent, TorrentComment
# from mediainfo.models import Mediainfo


class AdminTorrentSerializer(serializers.ModelSerializer):
    size = serializers.SerializerMethodField()
    info_hash = serializers.CharField(source='swarm_id')
    file_list = serializers.ListField()
    mediainfo = AdminMediainfoSerializer()

    class Meta:
        model = Torrent
        fields = (
            'id',
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
            'info_hash',
            'file_list',
            'nfo',
            'mediainfo',
            'description',
            'comments',
        )

    @staticmethod
    def get_size(obj):
        return filesizeformat(obj.size_in_bytes)
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


class TorrentCommentSerializer(serializers.ModelSerializer):
    """
    Serializer for Torrent Comments. Author is the users foreign key to Torrent comments.
    We are returning the author into a foreign key representation, and string representation.
    """
    film_id = serializers.PrimaryKeyRelatedField(source='torrent.film', read_only=True)
    torrent_name = serializers.StringRelatedField(
        source='torrent.release_name',
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
