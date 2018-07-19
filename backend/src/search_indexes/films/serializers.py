import json

from django_elasticsearch_dsl_drf.serializers import DocumentSerializer
from rest_framework import serializers

from films.documents import FilmDocument


class GenreTagSerializer(serializers.Serializer):
    """Helper serializer for the Genre Tag field of the Film document."""

    title = serializers.CharField()

    class Meta(object):
        """Meta options."""

        fields = ('name',)
        read_only_fields = ('name',)


class FilmDocumentSerializer(DocumentSerializer):
    """Serializer for the Book document."""

    genre_tags = serializers.SerializerMethodField()

    class Meta(object):
        """Meta options."""

        # Specify the correspondent document class
        document = FilmDocument

        # List the serializer fields. Note, that the order of the fields
        # is preserved in the ViewSet.
        fields = (
            'id',
            'title',
            'description',
            'genre_tags',
            'year',
        )

    def get_genre_tags(self, obj):
        """Get tags."""
        return json.loads(obj.genre_tags)
