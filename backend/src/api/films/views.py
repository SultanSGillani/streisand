# -*- coding: utf-8 -*-

from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.viewsets import ModelViewSet
from rest_framework import response, status
from api.pagination import DetailPagination
from films.models import Film, Collection, CollectionComment, FilmComment
from .filters import FilmFilter, CollectionFilter
from .serializers import AdminFilmSerializer, CollectionSerializer, FilmCommentSerializer, CollectionCommentSerializer, \
    PublicFilmSerializer


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
    ).distinct(
        'id'
    )

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save(author=self.request.user)
            return response.Response(data=serializer.data)
        return response.Response(status=status.HTTP_400_BAD_REQUEST)


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
    ).distinct(
        'id'
    )

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save(author=self.request.user)
            return response.Response(data=serializer.data)
        return response.Response(status=status.HTTP_400_BAD_REQUEST)


class CollectionViewSet(ModelViewSet):
    """
    API endpoint that allows film-collections to be viewed or edited.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = CollectionSerializer
    pagination_class = DetailPagination
    queryset = Collection.objects.all().select_related(
        'creator',
    ).prefetch_related(
        'films',
        'films__genre_tags',
        'films__lists',
        'films__comments',
        'comments',
        'comments__author',
    ).order_by(
        '-id',
    ).distinct(
        'id'
    )
    filter_backends = [DjangoFilterBackend]
    filter_class = CollectionFilter

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save(creator=self.request.user)
            return response.Response(data=serializer.data)
        return response.Response(status=status.HTTP_400_BAD_REQUEST)


class FilmViewSet(ModelViewSet):
    """
    API endpoint that allows films to be viewed or edited.
    """
    serializer_class = AdminFilmSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filter_class = FilmFilter
    queryset = Film.objects.all().select_related('imdb', ).prefetch_related(
        'genre_tags',
        'lists',
        'comments',
        'comments__author',
    ).order_by('-id', ).distinct('id')

    # Without the below and updating permissions classes from IsAdminUser to IsAuthenticated,
    # New users cant see this film.

    def get_serializer_class(self):
        if self.request.user.is_staff:
            return AdminFilmSerializer
        return PublicFilmSerializer
