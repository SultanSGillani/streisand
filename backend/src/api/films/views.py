from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.viewsets import ModelViewSet
from django_filters import rest_framework as filters

from www.pagination import FilmPageNumberPagination
from films.models import Film, Collection, CollectionComment, FilmComment
from .serializers import AdminFilmSerializer, CollectionSerializer, FilmCommentSerializer, CollectionCommentSerializer
from .filters import FilmFilter, CollectionFilter


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
        'collection_tags',
        'collections_comments',
        'collections_comments__author',
    ).order_by(
        '-id',
    ).distinct('id')
    pagination_class = FilmPageNumberPagination
    filter_backends = (filters.DjangoFilterBackend,)
    filter_class = CollectionFilter

    def get_queryset(self):

        queryset = super().get_queryset()

        # Tag filtering
        if 'collection_tags' in self.request.query_params:
            queryset = queryset.filter(collection_tags__name=self.request.query_params['collection_tags'])

        return queryset


class FilmViewSet(ModelViewSet):
    """
    API endpoint that allows films to be viewed or edited.
    """
    permission_classes = [IsAdminUser]
    serializer_class = AdminFilmSerializer
    queryset = Film.objects.all().select_related(
        'imdb',
    ).prefetch_related(
        'tags',
        'lists',
        'comments',
        'comments__author',
    ).order_by(
        '-id',
    ).distinct('id')
    pagination_class = FilmPageNumberPagination
    filter_backends = (filters.DjangoFilterBackend,)
    filter_class = FilmFilter

    def get_queryset(self):

        queryset = super().get_queryset()

        # Tag filtering
        if 'tag' in self.request.query_params:
            queryset = queryset.filter(tags__name=self.request.query_params['tag'])

        return queryset
