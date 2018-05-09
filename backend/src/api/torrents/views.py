from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.viewsets import ModelViewSet

from .filters import TorrentFilter
from django_filters import rest_framework as filters

from www.pagination import TorrentPageNumberPagination

from torrents.models import Torrent, TorrentComment
from .serializers import AdminTorrentSerializer, TorrentCommentSerializer


class TorrentCommentViewset(ModelViewSet):
    """
    API That Allows Torrent Comments to be viewed, created, or deleted. If you delete the associated film or torrent,
    The comment will be deleted as well.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = TorrentCommentSerializer
    queryset = TorrentComment.objects.all().select_related(
        'torrent',
        'torrent__film',
        'author',
    ).prefetch_related('torrent', 'author').order_by('id').distinct('id')
    pagination_class = TorrentPageNumberPagination

    """
    This will automatically associate the comment author with the torrent comment on creation,
    since we already know that the comment author is the currently logged in user.
    """
    def perform_create(self, serializer):
        serializer.validated_data['author'] = self.request.user
        return super(TorrentCommentViewset, self).perform_create(serializer)

    def get_queryset(self):

        queryset = super().get_queryset()

        film_id = self.request.query_params.get('film_id', None)
        if film_id is not None:
            queryset = queryset.filter(film_id=film_id)

        return queryset


class TorrentViewSet(ModelViewSet):
    """
    API That currently only allows Torrents to be viewed, and searched.
    Pagination is set at Page Number Pagination, for 35 Torrents at a time for now.
    """
    permission_classes = [IsAdminUser]
    serializer_class = AdminTorrentSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filter_class = TorrentFilter
    pagination_class = TorrentPageNumberPagination
    queryset = Torrent.objects.all().select_related(
        'film',
        'mediainfo',
        'source_media',
        'uploaded_by',
        'moderated_by',
    ).prefetch_related(
        'film',
        'uploaded_by',
        'moderated_by',
        'source_media',
        'mediainfo',
        'comments',
        'comments__author',
    ).order_by('id', 'source_media',).distinct('id', 'source_media',)

    def get_queryset(self):

        queryset = super().get_queryset()

        film_id = self.request.query_params.get('film_id', None)
        if film_id is not None:
            queryset = queryset.filter(film_id=film_id)

        return queryset
