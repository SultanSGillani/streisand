# -*- coding: utf-8 -*-

from rest_framework import pagination
from rest_framework.fields import Field
from rest_framework.pagination import _positive_int
from rest_framework.settings import api_settings


class PaginatedRelationField(Field):
    """
    Modified Version of https://github.com/raccoonyy/drf-relate-pagination

    """

    def __init__(self, serializer, filters=None, paginator=None,
                 **kwargs):

        self.serializer = serializer

        if paginator is None:
            paginator = api_settings.DEFAULT_PAGINATION_CLASS

        self.paginator = paginator()

        # Filters should be a dict, for example: {'pk': 1}
        self.filters = filters

        super(PaginatedRelationField, self).__init__(**kwargs)

    def to_representation(self, related_objects):
        if self.filters:
            related_objects = related_objects.filter(**self.filters)

        request = self.context.get('request')

        serializer = self.serializer(
            related_objects, many=True, context={'request': request}
        )

        paginated_data = self.paginator.paginate_queryset(
            queryset=serializer.data, request=request
        )

        result = self.paginator.get_paginated_response(paginated_data)

        return result


class RelationPaginator(pagination.PageNumberPagination):
    """
    Modified and added in a queryset. change size below if the keyword should be different.
    For example: /api/v1/threads/?size=1 will only show 1 thread.
    https://github.com/raccoonyy/drf-relate-pagination
    """
    page_size_query_param = 'size'

    max_page_size = api_settings.PAGE_SIZE

    def get_paginated_response(self, data):
        return {
            'links': {
                'next': self.get_next_link(),
                'previous': self.get_previous_link()
            },
            'current_page': self.page.number,
            'num_pages': self.page.paginator.num_pages,
            'count': self.page.paginator.count,
            'results': data
        }

    def get_page_size(self, request):

        if self.page_size_query_param in request.query_params:

            try:

                return _positive_int(

                    request.query_params[self.page_size_query_param],

                    strict=True,

                    cutoff=self.max_page_size

                )

            except (KeyError, ValueError):

                pass

        return self.page_size
