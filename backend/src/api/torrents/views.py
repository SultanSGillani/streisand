# -*- coding: utf-8 -*-

from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.parsers import JSONParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet

from api.throttling import DOSDefenseThrottle
from torrent_requests.models import TorrentRequest
from torrent_stats.models import TorrentStats
from torrents.models import TorrentFile
from torrents.utils import TorrentFileUploadParser

from .filters import TorrentFilter
from .serializers import TorrentFileSerializer, TorrentStatSerializer, TorrentRequestSerializer


class TorrentStatViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = TorrentStatSerializer
    queryset = TorrentStats.objects.all().select_related(
        'torrent__release__film',
        'user',
    ).order_by(
        'last_snatched'
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


class TorrentFileViewSet(ModelViewSet):
    """
    API That currently only allows Torrents to be viewed, and searched.
    Pagination is set at Page Number Pagination, for 35 Torrents at a time for now.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = TorrentFileSerializer
    parser_classes = [JSONParser, TorrentFileUploadParser]
    throttle_classes = [DOSDefenseThrottle]
    filter_backends = [DjangoFilterBackend]
    filter_class = TorrentFilter

    queryset = TorrentFile.objects.select_related(
        'release__film',
        'release__mediainfo',
        'release__source_media',
        'uploaded_by',
        'moderated_by',
    ).order_by(
        'release__film_id',
        'release__source_media_id',
    ).distinct(
        'release__film_id',
        'release__source_media_id',
    )

    def get_serializer_context(self):
        return {'request': self.request}
