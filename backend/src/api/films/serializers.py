# -*- coding: utf-8 -*-

from django.core.paginator import Paginator
from rest_framework import serializers

from api.mixins import AllowFieldLimitingMixin
from api.users.serializers import DisplayUserSerializer
from films.models import Film, Collection, CollectionComment, FilmComment


# TODO: Add permissions for film and collection creation, and deletion.


class FilmCommentSerializer(AllowFieldLimitingMixin, serializers.ModelSerializer):
    """
      Serializer for Film Comments. author is the users foreign key to FIlm comments.
      We are returning the author into a foreign key representation, and string representation.
      """
    author = DisplayUserSerializer(read_only=True)

    class Meta:
        model = FilmComment
        fields = (
            'film',
            'author',
            'text',
            'created_at',
            'modified_at'
        )

    def create(self, validated_data):
        validated_data['author'] = self.context['request'].user
        return super().create(validated_data)


class CollectionCommentSerializer(AllowFieldLimitingMixin, serializers.ModelSerializer):
    """
    Same as the Film Comment Serializer
    """
    author = DisplayUserSerializer(read_only=True)

    class Meta:
        model = CollectionComment
        fields = (
            'collection',
            'author',
            'text',
            'created_at',
            'modified_at'
        )

    def create(self, validated_data):
        validated_data['author'] = self.context['request'].user
        return super().create(validated_data)


class AdminFilmSerializer(AllowFieldLimitingMixin, serializers.ModelSerializer):
    """
      Serializer for For Films. This is the serializer that Administrators/staff will have access to.
      """
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
            'lists',
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
    """
      Remove Moderation Notes, and you have a serializer for everyone else.
      """

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        remove_fields = ('moderation_notes',)
        for field_name in remove_fields:
            self.fields.pop(field_name)


class CollectionSerializer(AllowFieldLimitingMixin, serializers.ModelSerializer):
    """
      Serializer for collections of films. Notice the Allow Field Limiting mixin. You can
      use that for example api/v1/?fields=field1,field2,field3.
      Or you can hide specific fields for example: api/v1/?omit=field1,field2

      """
    creator = DisplayUserSerializer(read_only=True)
    comments = CollectionCommentSerializer(read_only=True, many=True)
    film_id = serializers.PrimaryKeyRelatedField(
        source='films',
        write_only=True,
        allow_null=True,
        required=False,
        queryset=Film.objects.all(),
        many=True
    )
    films = serializers.SerializerMethodField('paginated_films')
    films_count = serializers.SerializerMethodField()

    class Meta(FilmCommentSerializer.Meta):
        """
            Add in the fields from the collections comment serializer as a nested meta field.
            eg: 'collection',
                'author',
                'author_username',
                ...
            """

        model = Collection

        fields = (
            'creator',
            'comments',
            'id',
            'url',
            'title',
            'description',
            'film_id',
            'films',
            'films_count',
        )

    def create(self, validated_data):
        validated_data['creator'] = self.context['request'].user
        return super().create(validated_data)

    def get_films_count(self, obj):
        return obj.films.count()

    """
    paginate a related field to be able to use a query param on nested data
    For example: /api/v1/film-collections/{pk}/size=1 would show only 1 nested film.
            ...
    """

    def paginated_films(self, obj):
        page_size = self.context['request'].query_params.get('size') or 25
        paginator = Paginator(obj.films.all(), page_size)
        page = self.context['request'].query_params.get('page') or 1

        films = paginator.page(page)
        serializer = PublicFilmSerializer(films, many=True)

        return serializer.data
