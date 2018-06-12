# -*- coding: utf-8 -*-

from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.viewsets import ModelViewSet

from films.models import Film, Collection, CollectionComment, FilmComment

from .filters import FilmFilter, CollectionFilter
from .serializers import AdminFilmSerializer, CollectionSerializer, FilmCommentSerializer, CollectionCommentSerializer


class CollectionCommentViewSet(ModelViewSet):
    """
    API endpoint that allows film-collection-comments to be viewed or edited.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = CollectionCommentSerializer
    queryset = CollectionComment.objects.all().select_related(
        'author',
    ).prefetch_related(
        'collection',
        'author',
    ).order_by(
        '-id'
    ).distinct('id')


class FilmCommentViewSet(ModelViewSet):
    """
    API endpoint that allows film-comments to be viewed or edited.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = FilmCommentSerializer
    queryset = FilmComment.objects.all().select_related(
        'author',
    ).prefetch_related(
        'film',
        'author',
    ).order_by(
        '-id'
    ).distinct('id')


class CollectionViewSet(ModelViewSet):
    """
    API endpoint that allows film-collections to be viewed or edited.
    """
    permission_classes = [IsAdminUser]
    serializer_class = CollectionSerializer
    queryset = Collection.objects.all().select_related(
        'creator',
    ).prefetch_related(
        'film',
        'comments',
        'comments__author',
    ).order_by(
        '-id',
    ).distinct('id')
    filter_backends = [DjangoFilterBackend]
    filter_class = CollectionFilter


class FilmViewSet(ModelViewSet):
    """
    API endpoint that allows films to be viewed or edited.
    """
    permission_classes = [IsAdminUser]
    serializer_class = AdminFilmSerializer
    filter_backends = [DjangoFilterBackend]
    filter_class = FilmFilter
    queryset = Film.objects.all().select_related(
        'imdb',
    ).prefetch_related(
        'genre_tags',
        'lists',
        'comments',
        'comments__author',
    ).order_by(
        '-id',
    ).distinct('id')
