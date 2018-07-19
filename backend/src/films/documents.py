from django.conf import settings
from django_elasticsearch_dsl import DocType, Index, fields
from elasticsearch_dsl import analyzer

from films.models import Film

# Name of the Elasticsearch index
INDEX = Index(settings.ELASTICSEARCH_INDEX_NAMES[__name__])

# See Elasticsearch Indices API reference for available settings
INDEX.settings(
	number_of_shards=1,
	number_of_replicas=1
)

html_strip = analyzer(
	'html_strip',
	tokenizer="standard",
	filter=["standard", "lowercase", "stop", "snowball"],
	char_filter=["html_strip"]
)


@INDEX.doc_type
class FilmDocument(DocType):
	"""Book Elasticsearch document."""

	id = fields.IntegerField(attr='id')

	title = fields.StringField(
		analyzer=html_strip,
		fields={
			'raw': fields.StringField(analyzer='keyword'),
		}
	)

	description = fields.StringField(
		analyzer=html_strip,
		fields={
			'raw': fields.StringField(analyzer='keyword'),
		}
	)

	year = fields.DateField()

	genre_tags = fields.StringField(
		attr='genre_tags_indexing',
		analyzer=html_strip,
		fields={
			'raw': fields.StringField(analyzer='keyword', multi=True),
		},
		multi=True
	)

	class Meta(object):
		"""Meta options."""

		model = Film  # The model associate with this DocType
