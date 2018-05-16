from rest_framework.pagination import PageNumberPagination, _positive_int
from rest_framework.response import Response
from rest_framework.settings import api_settings


# source https://gist.github.com/marctc/9fa2a08d4fc51df6d9dc
class DetailPagination(PageNumberPagination):
    page_size_query_param = 'size'
    max_page_size = api_settings.PAGE_SIZE
    page_query_param = 'page'

    def get_paginated_response(self, data):
        return Response({
            'next': self.get_next_link(),
            'previous': self.get_previous_link(),
            'count': self.page.paginator.count,
            'current_page': self.page.number,
            'num_pages': self.page.paginator.num_pages,
            'results': data
        })

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
