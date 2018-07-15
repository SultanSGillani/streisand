from django_elasticsearch_dsl_drf.serializers import DocumentSerializer

from search_indexes.documents.film import FilmDocument


class FilmDocumentSerializer(DocumentSerializer):
    """Serializer for the Book document."""

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
            'imdb',
            'rotten_tomatoes',
            'year',
        )
