from rest_framework.pagination import PageNumberPagination, LimitOffsetPagination, CursorPagination, _positive_int
from rest_framework.response import Response


# source https://gist.github.com/marctc/9fa2a08d4fc51df6d9dc
class DetailPagination(PageNumberPagination):
    page_size_query_param = 'size'

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


class WikiPageNumberPagination(PageNumberPagination):
    page_size = 25


class ForumsLimitOffsetPagination(LimitOffsetPagination):
    default_limit = 10
    max_limit = 10


class ForumsPageNumberPagination(PageNumberPagination):
    page_size = 15


class ForumThreadCursorSetPagination(CursorPagination):
    page_size = 5
    page_size_query_param = 'page_size'
    ordering = '-created_at'  # '-creation' is default


class ForumTopicCursorSetPagination(CursorPagination):
    page_size = 5
    page_size_query_param = 'page_size'
    ordering = 'sort_order'  # '-creation' is default


class FilmCursorPagination(CursorPagination):
    page_size = 5
    page_size_query_param = 'page_size'
    ordering = '-id'  # '-creation' is default


class CollectionCursorPagination(CursorPagination):
    page_size = 5
    page_size_query_param = 'page_size'
    ordering = '-id'  # '-creation' is default


class FilmPageNumberPagination(PageNumberPagination):
    page_size = 25


class UserPageNumberPagination(PageNumberPagination):
    page_size = 25


class TorrentPageNumberPagination(PageNumberPagination):
    page_size = 35
