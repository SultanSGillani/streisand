# -*- coding: utf-8 -*-

from django_filters import rest_framework as filters
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.viewsets import ModelViewSet

from torrent_requests.models import TorrentRequest
from torrent_stats.models import TorrentStats
from torrents.models import TorrentFile, TorrentComment
from torrents.utils import TorrentFileUploadParser

from .filters import TorrentFilter
from .serializers import AdminTorrentSerializer, TorrentCommentSerializer, TorrentStatSerializer, TorrentRequestSerializer, TorrentUploadSerializer


class TorrentStatViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = TorrentStatSerializer
    queryset = TorrentStats.objects.all().select_related(
        'torrent',
        'torrent__film',
        'user',
    ).order_by(
        'torrent'
    )


class TorrentRequestViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = TorrentRequestSerializer
    queryset = TorrentRequest.objects.all().select_related(
        'created_by',
        'filling_torrent',
        'source_media',
        'resolution',
        'codec',
        'container',
    ).prefetch_related(
        'torrent', 'created_by'
    ).order_by(
        'created_at'
    )

    def perform_create(self, serializer):
        serializer.validated_data['created_by'] = self.request.user
        return super(TorrentRequestViewSet, self).perform_create(serializer)

    def get_queryset(self):
        queryset = super().get_queryset()

        torrent_request_id = self.request.query_params.get('torrent_request_id', None)
        if torrent_request_id is not None:
            queryset = queryset.filter(torrent_request_id=torrent_request_id)

        return queryset

class TorrentCommentViewSet(ModelViewSet):
    """
    API That Allows Torrent Comments to be viewed, created, or deleted. If you delete the associated film or torrent,
    The comment will be deleted as well.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = TorrentCommentSerializer
    queryset = TorrentComment.objects.all().select_related(
        'torrent',
        'torrent__release__film',
        'author',
    ).order_by('id').distinct('id')

    """
    This will automatically associate the comment author with the torrent comment on creation,
    since we already know that the comment author is the currently logged in user.
    """

    def perform_create(self, serializer):
        serializer.validated_data['author'] = self.request.user
        return super(TorrentCommentViewSet, self).perform_create(serializer)

    def get_queryset(self):
        queryset = super().get_queryset()

        film_id = self.request.query_params.get('film_id', None)
        if film_id is not None:
            queryset = queryset.filter(torrent__release__film_id=film_id)

        return queryset


class TorrentViewSet(ModelViewSet):
    """
    API That currently only allows Torrents to be viewed, and searched.
    Pagination is set at Page Number Pagination, for 35 Torrents at a time for now.
    """
    permission_classes = [IsAdminUser]
    serializer_class = AdminTorrentSerializer
    filter_backends = [filters.DjangoFilterBackend]
    filter_class = TorrentFilter
    queryset = TorrentFile.objects.all().select_related(
        'release__film',
        'release__mediainfo',
        'release__source_media',
        'uploaded_by',
        'moderated_by',
    ).prefetch_related(
        'comments',
        'comments__author',
    ).order_by(
        'release__film_id',
        'release__source_media_id',
    ).distinct(
        'release__film_id',
        'release__source_media_id',
    )


class TorrentUploadViewSet(ModelViewSet):
    """
    API for uploading torrent files.
    """
    permission_classes = [IsAdminUser]
    serializer_class = TorrentUploadSerializer
    parser_classes = [TorrentFileUploadParser]
    queryset = TorrentFile.objects.all()

    def get_serializer_context(self):
        return {'request': self.request}
