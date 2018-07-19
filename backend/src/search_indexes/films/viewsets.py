from django_elasticsearch_dsl_drf.constants import (
	LOOKUP_FILTER_TERMS,
	LOOKUP_FILTER_RANGE,
	LOOKUP_FILTER_PREFIX,
	LOOKUP_FILTER_WILDCARD,
	LOOKUP_QUERY_IN,
	LOOKUP_QUERY_EXCLUDE,
)
from django_elasticsearch_dsl_drf.filter_backends import (
	FacetedSearchFilterBackend,
)

from elasticsearch_dsl import (
	DateHistogramFacet,
	RangeFacet,
	TermsFacet,
)
from django_elasticsearch_dsl_drf.filter_backends import (
	FilteringFilterBackend,
	OrderingFilterBackend,
	SearchFilterBackend,
)
from django_elasticsearch_dsl_drf.viewsets import BaseDocumentViewSet

# Example app models
from films.documents import FilmDocument
from .serializers import FilmDocumentSerializer


class FilmDocumentView(BaseDocumentViewSet):
	"""The BookDocument view."""

	document = FilmDocument
	serializer_class = FilmDocumentSerializer
	lookup_field = 'id'
	filter_backends = [
		FilteringFilterBackend,
		OrderingFilterBackend,
		SearchFilterBackend,
		FacetedSearchFilterBackend,
	]
	# Define search fields
	search_fields = (
		'title',
		'description',
		'year',
		'genre_tags',

	)
	# Define filtering fields
	filter_fields = {
		'id': {
			'field': '_id',
			'lookups': [
				LOOKUP_FILTER_RANGE,
				LOOKUP_QUERY_IN,
			],
		},
		'genre_tags': {
			'field': 'genre_tags',
			'lookups': [
				LOOKUP_FILTER_TERMS,
				LOOKUP_FILTER_PREFIX,
				LOOKUP_FILTER_WILDCARD,
				LOOKUP_QUERY_IN,
				LOOKUP_QUERY_EXCLUDE,
			],
		},
		'genre_tags.raw': {
			'field': 'genre_tags.raw',
			'lookups': [
				LOOKUP_FILTER_TERMS,
				LOOKUP_FILTER_PREFIX,
				LOOKUP_FILTER_WILDCARD,
				LOOKUP_QUERY_IN,
				LOOKUP_QUERY_EXCLUDE,
			],
		},
	}
	faceted_search_fields = {
		'year': {
			'field': 'year',
			'facet': DateHistogramFacet,
			'options': {
				'interval': 'year',
			}
		},
		'pages_count': {
			'field': 'pages',
			'facet': RangeFacet,
			'options': {
				'ranges': [
					("<10", (None, 10)),
					("11-20", (11, 20)),
					("20-50", (20, 50)),
					(">50", (50, None)),
				]
			}
		},
	}
	# Define ordering fields
	ordering_fields = {
		'id': 'id',
		'title': 'title.raw',
		'year': 'year',
	}
	# Specify default ordering
	ordering = ('id', 'title',)
