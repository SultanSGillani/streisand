# -*- coding: utf-8 -*-

from django_filters.rest_framework import DjangoFilterBackend
from djangorestframework_camel_case.parser import CamelCaseJSONParser
from rest_framework import mixins
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.viewsets import ModelViewSet, GenericViewSet

from api.throttling import DOSDefenseThrottle
from torrent_requests.models import TorrentRequest
from torrent_stats.models import TorrentStats
from torrents.models import TorrentFile, ReseedRequest
from torrents.utils import TorrentFileUploadParser
from .filters import TorrentFilter
from .serializers import TorrentFileSerializer, TorrentStatSerializer, TorrentRequestSerializer, ReseedRequestSerializer


class TorrentStatViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = TorrentStatSerializer
    queryset = TorrentStats.objects.all().select_related(
        'torrent__release__film',
        'user',
    ).order_by(
        'last_snatched'
    )

    def get_serializer_context(self):
        return {'request': self.request}


class ReseedRequestViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = ReseedRequestSerializer
    queryset = ReseedRequest.objects.all().select_related(
        'torrent',
        'created_by',
        'active_on_torrent',
    ).order_by(
        '-created_at'
    )

    def perform_create(self, serializer):
        serializer.validated_data['created_by'] = self.request.user
        return super(ReseedRequestViewSet, self).perform_create(serializer)

    def get_queryset(self):
        queryset = super().get_queryset()

        torrent_id = self.request.query_params.get('torrent_id', None)
        if torrent_id is not None:
            queryset = queryset.filter(reseed_request__torrent__id=torrent_id)

        return queryset

    def get_serializer_context(self):
        return {'request': self.request}


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
    parser_classes = [CamelCaseJSONParser, TorrentFileUploadParser]
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


class TorrentFileWithNoReleaseViewSet(mixins.ListModelMixin, mixins.RetrieveModelMixin, mixins.UpdateModelMixin,
                                      mixins.DestroyModelMixin, GenericViewSet):
    """
    API That shows Torrents uploaded with null releases. This api is for staff to handle these torrents
    uploaded incorrectly.
    """
    permission_classes = [IsAdminUser]
    serializer_class = TorrentFileSerializer
    throttle_classes = [DOSDefenseThrottle]

    queryset = TorrentFile.objects.all().select_related(
        'release__film',
        'release__mediainfo',
        'release__source_media',
        'uploaded_by',
        'moderated_by',
    ).order_by(
        'uploaded_at',
        'release__film_id',
        'release__source_media_id',
    ).distinct(
        'uploaded_at',
        'release__film_id',
        'release__source_media_id',
    ).filter(release__isnull=True)

    def get_serializer_context(self):
        return {'request': self.request}
