# -*- coding: utf-8 -*-

from django.core.paginator import Paginator, InvalidPage, PageNotAnInteger
from rest_framework import serializers

from api.mixins import AllowFieldLimitingMixin
from api.users.serializers import DisplayUserSerializer
from films.models import Film, Collection, CollectionComment, FilmComment


class FilmCommentSerializer(AllowFieldLimitingMixin, serializers.ModelSerializer):
    author = DisplayUserSerializer(read_only=True)
    body = serializers.CharField(source='text')

    class Meta:
        model = FilmComment
        fields = (
            'id',
            'film',
            'author',
            'body',
            'created_at',
            'modified_at'
        )

    def create(self, validated_data):
        validated_data['author'] = self.context['request'].user
        return super().create(validated_data)


class CollectionCommentSerializer(AllowFieldLimitingMixin, serializers.ModelSerializer):
    author = DisplayUserSerializer(read_only=True)
    body = serializers.CharField(source='text')

    class Meta:
        model = CollectionComment
        fields = (
            'id',
            'collection',
            'author',
            'body',
            'created_at',
            'modified_at'
        )

    def create(self, validated_data):
        validated_data['author'] = self.context['request'].user
        return super().create(validated_data)


class AdminFilmSerializer(AllowFieldLimitingMixin, serializers.ModelSerializer):
    film_comments = FilmCommentSerializer(
        read_only=True,
        many=True,
        source='comments',
        help_text="Get all fields from the comment serializer and add them as a nested child."
    )

    imdb_id = serializers.SerializerMethodField()

    class Meta(FilmCommentSerializer.Meta):
        model = Film
        fields = (
            'id',
            'title',
            'year',
            'imdb_id',
            'tmdb_id',
            'poster_url',
            'fanart_url',
            'film_comments',
            'trailer_url',
            'trailer_type',
            'duration_in_minutes',
            'description',
            'moderation_notes',
            'genre_tags',
        )

    def get_imdb_id(self, film):
        if film.imdb:
            return film.imdb.tt_id

    extra_kwargs = {
        'genre_tags': {
            'required': False
        },
        'fanart_url': {
            'required': False
        },
        'moderation_notes': {
            'required': False
        },
    }


class PublicFilmSerializer(AdminFilmSerializer):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        remove_fields = ('moderation_notes',)
        for field_name in remove_fields:
            self.fields.pop(field_name)


class CollectionCreateSerializer(serializers.ModelSerializer):
    films_count = serializers.SerializerMethodField()

    class Meta:
        model = Collection
        fields = (
            'id',
            'creator',
            'title',
            'description',
            'films',
            'films_count',
        )

    def create(self, validated_data):
        validated_data['creator'] = self.context['request'].user
        return super().create(validated_data)

    def get_films_count(self, obj):
        return obj.films.count()


class CollectionListSerializer(AllowFieldLimitingMixin, serializers.ModelSerializer):

    films = serializers.SerializerMethodField('paginated_films')
    films_count = serializers.SerializerMethodField()

    class Meta:
        model = Collection

        fields = (
            'id',
            'creator',
            'title',
            'description',
            'films',
            'films_count',
        )

    def get_films_count(self, obj):
        return obj.films.count()

    def paginated_films(self, obj):
        page_size = self.context['request'].query_params.get('size') or 25
        paginator = Paginator(obj.films.all(), page_size)
        page = self.context['request'].query_params.get('page') or 1

        try:
            films = paginator.page(page)
            serializer = PublicFilmSerializer(films, many=True)

        except (InvalidPage, PageNotAnInteger):
            # Page doesn't exist, so return them to page 1 results.

            films = paginator.page(1)
            serializer = PublicFilmSerializer(films, many=True)

        return serializer.data
