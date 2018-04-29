# -*- coding: utf-8 -*-

from rest_framework import serializers

from films.models import Film, Collection, CollectionComment, FilmComment


# TODO: Add permissions for film and collection creation, and deletion.

class FilmCommentSerializer(serializers.ModelSerializer):
    """
    Serializer for Film Comments. author is the users foreign key to FIlm comments.
    We are returning the author into a foreign key representation, and string representation.
    """
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

    class Meta:
        model = FilmComment
        fields = (
            'film',
            'author',
            'author_username',
            'text',
            'created_at',
            'modified_at'
        )


class CollectionCommentSerializer(serializers.ModelSerializer):
    """
    Same as the Film Comment Serializer
    """
    author = serializers.PrimaryKeyRelatedField(
        default=serializers.CurrentUserDefault(),
        read_only=True,
        help_text="The ID of the user that created this collection comment; if none is provided, "
                  "defaults to the currently logged in user."
    )
    author_username = serializers.StringRelatedField(
        source='author',
        default=serializers.CurrentUserDefault(),
        read_only=True,
        help_text="The string representation of the user that created this collection comment; if none is provided, "
        "defaults to the currently logged in user."
    )

    class Meta:
        model = CollectionComment
        fields = (
            'collection',
            'author',
            'author_username',
            'text',
            'created_at',
            'modified_at'
        )


class AdminFilmSerializer(serializers.ModelSerializer):
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
            'tags',
        )

    def get_imdb_id(self, film):
        if film.imdb:
            return film.imdb.tt_id


class PublicFilmSerializer(AdminFilmSerializer):
    """
    Remove Moderation Notes, and you have a serializer for everyone else.
    """
    # TODO: make this serializer more robust
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        remove_fields = (
            'moderation_notes',
        )
        for field_name in remove_fields:
            self.fields.pop(field_name)


class CollectionSerializer(serializers.ModelSerializer):
    """
    Serializer for collections. We are adding some custom naming conventions here.
    However, source='creator' would be the field that it references in the model.
    """
    creator_id = serializers.PrimaryKeyRelatedField(
        default=serializers.CurrentUserDefault(),
        read_only=True,
        source='creator',
        help_text="The ID of the user that created this collection object; if none is provided,"
                  "defaults to the currently logged in user."
    )
    creator_username = serializers.StringRelatedField(
        default=serializers.CurrentUserDefault(),
        read_only=True,
        source='creator',
        help_text="The string representation of the user that created this collection object; if none is provided, "
        "defaults to the currently logged in user."
    )
    list_id = serializers.IntegerField(source='id', read_only=True)
    list_title = serializers.CharField(source='title')
    list_description = serializers.CharField(source='description')
    film = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Film.objects.all(),
        help_text="Since we are not making this read_only, "
                  "we have to give a queryset for the primary key related field"
                  "We don't want this to be read only, since users need to add or remove a film from a coollection."
    )
    film_title = serializers.StringRelatedField(many=True, read_only=True, source='film')
    film_link = serializers.HyperlinkedRelatedField(
        many=True,
        read_only=True,
        source='film',
        view_name='film-detail'
    )
    url = serializers.HyperlinkedIdentityField(read_only=True, view_name='collection-detail')
    collection_comments = CollectionCommentSerializer(source='collections_comments', many=True, read_only=True)

    class Meta(CollectionCommentSerializer.Meta):

        """
        Add in the fields from the collections comment serializer as a nested meta field.
        eg: 'collection',
            'author',
            'author_username',
            ...
        """

        model = Collection
        fields = (
            'creator_id',
            'creator_username',
            'collection_comments',
            'list_id',
            'url',
            'list_title',
            'list_description',
            'collection_tags',
            'film',
            'film_title',
            'film_link'
        )
