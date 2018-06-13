# -*- coding: utf-8 -*-

from rest_framework import serializers

from films.models import Film
from mediainfo.serializers import MediainfoSerializer
from releases.models import Release, ReleaseComment

from ..films.serializers import PublicFilmSerializer
from ..users.serializers import DisplayUserProfileSerializer


class ReleaseSerializer(serializers.ModelSerializer):

    film_id = serializers.PrimaryKeyRelatedField(
        source='film',
        write_only=True,
        allow_null=True,
        required=False,
        queryset=Film.objects.all(),
    )
    film = PublicFilmSerializer(required=False, read_only=True)
    mediainfo = MediainfoSerializer()
    nfo = serializers.CharField(required=False)
    description = serializers.CharField()
    release_name = serializers.CharField(source='name')
    release_group = serializers.CharField(source='group')
    cut = serializers.CharField()
    codec = serializers.CharField(source='codec_id')
    container = serializers.CharField(source='container_id')
    resolution = serializers.CharField(source='resolution_id')
    source_media = serializers.CharField(source='source_media_id')
    is_source = serializers.BooleanField()
    is_scene = serializers.BooleanField()
    is_3d = serializers.BooleanField()

    class Meta:
        model = Release
        fields = (
            'id',
            'film',
            'film_id',
            'cut',
            'codec',
            'container',
            'resolution',
            'source_media',
            'is_source',
            'is_scene',
            'is_3d',
            'release_name',
            'release_group',
            'nfo',
            'mediainfo',
            'description',
        )


class ReleaseCommentSerializer(serializers.ModelSerializer):
    """
    Serializer for Torrent Comments. Author is the users foreign key to Torrent comments.
    We are returning the author into a foreign key representation, and string representation.
    """
    film_id = serializers.PrimaryKeyRelatedField(source='release.film', read_only=True)
    release_name = serializers.StringRelatedField(
        source='release.name',
        read_only=True,
        help_text="Read only field that shows the release name."
    )
    author = DisplayUserProfileSerializer(default=serializers.CurrentUserDefault())

    class Meta:
        model = ReleaseComment
        fields = (
            'id',
            'film_id',
            'release_name',
            'author',
            'text',
            'created_at',
            'modified_at',
        )
