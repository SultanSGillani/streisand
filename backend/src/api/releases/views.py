# -*- coding: utf-8 -*-

from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from media_formats.models import Codec, Container, Resolution, SourceMedia
from releases.models import Release, ReleaseComment

from .filters import ReleaseFilter
from .serializers import ReleaseSerializer, ReleaseCommentSerializer


class ReleaseViewSet(ModelViewSet):
    """
    API That currently only allows Releases to be viewed, and searched.
    """
    permission_classes = [IsAdminUser]
    serializer_class = ReleaseSerializer
    filter_backends = [DjangoFilterBackend]
    filter_class = ReleaseFilter
    queryset = Release.objects.select_related(
        'film',
        'mediainfo',
    ).prefetch_related(
        'comments',
        'comments__author',
    ).order_by(
        'film_id',
        'source_media_id',
    ).distinct(
        'film_id',
        'source_media_id',
    )

    def get_serializer_context(self):
        return {'request': self.request}


class ReleaseCommentViewSet(ModelViewSet):
    """
    API that allows ReleaseComments to be viewed, created, or deleted. If you delete the associated
    film or release, the comment will be deleted as well.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = ReleaseCommentSerializer
    queryset = ReleaseComment.objects.all().select_related(
        'release__film',
        'author',
    ).order_by('id').distinct('id')

    def get_queryset(self):
        queryset = super().get_queryset()

        film_id = self.request.query_params.get('film_id', None)
        if film_id is not None:
            queryset = queryset.filter(release__film_id=film_id)

        return queryset

    def get_serializer_context(self):
        return {'request': self.request}


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def valid_media_formats(request, *args, **kwargs):
    data = {
        'codecs': Codec.objects.values_list('name', flat=True),
        'containers': Container.objects.values_list('name', flat=True),
        'resolutions': Resolution.objects.values_list('name', flat=True),
        'source_media': SourceMedia.objects.values_list('name', flat=True),
    }
    return Response(data)
