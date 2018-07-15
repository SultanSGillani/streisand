from django_elasticsearch_dsl import DocType, Index

from elasticsearch_dsl import connections

from .models import Film

connections.create_connection(hosts=['elasticsearch'], timeout=20)

# Name of the Elasticsearch index
film = Index('films')
# See Elasticsearch Indices API reference for available settings


@film.doc_type
class FilmDocument(DocType):
    class Meta:
        model = Film  # The model associated with this DocType

        # The fields of the model you want to be indexed in Elasticsearch
        fields = [
            'title',
            'year',
            'description',
        ]
