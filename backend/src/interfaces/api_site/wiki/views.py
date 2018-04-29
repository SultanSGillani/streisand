from django.db.models import Q

from rest_framework.filters import (
    SearchFilter,
    OrderingFilter,
)
from rest_framework.response import Response

from rest_framework import mixins
from wiki.models import WikiArticle
from www.pagination import WikiPageNumberPagination

from rest_framework.permissions import IsAdminUser
from rest_framework.viewsets import GenericViewSet
from .serializers import WikiCreateUpdateDestroySerializer, WikiBodySerializer, WikiViewListOnlySerializer


class WikiArticleCreateUpdateDestroyViewSet(mixins.CreateModelMixin,
                                            mixins.RetrieveModelMixin, mixins.UpdateModelMixin,
                                            mixins.DestroyModelMixin,
                                            GenericViewSet):
    """
    API endpoint that allows Wikis to be created, edited, or deleted only. Options are HEAD, POST, PATCH, DELETE.
    """
    serializer_class = WikiCreateUpdateDestroySerializer
    filter_backends = [SearchFilter, OrderingFilter]
    permission_classes = [IsAdminUser]
    search_fields = ['title', 'created_by__username', 'read_access_minimum_user_class__username__userclass']
    pagination_class = WikiPageNumberPagination  # PageNumberPagination

    def partial_update(self, request, pk=None):
        serializer = WikiCreateUpdateDestroySerializer(request.user, data=request.data, partial=True)
        serializer.save()
        serializer.is_valid(raise_exception=True)
        return Response(serializer.data)

    def get_queryset(self, *args, **kwargs):
        queryset_list = WikiArticle.objects.all()  # filter(user=self.request.user)
        query = self.request.GET.get("q")
        if query:
            queryset_list = queryset_list.filter(
                Q(title__icontains=query) |
                Q(created_by__username__icontains=query) |
                Q(read_access_minimum_user_class__username__userclass__icontains=query)
            ).distinct()
        return queryset_list


class WikiArticleBodyViewSet(mixins.RetrieveModelMixin, mixins.UpdateModelMixin, GenericViewSet):
    """
    API endpoint that allows Wiki Body and body ID to be viewed, or Patched only.
    """
    permission_classes = [IsAdminUser]
    serializer_class = WikiBodySerializer
    search_fields = ['body', 'id']
    pagination_class = WikiPageNumberPagination  # PageNumberPagination

    def partial_update(self, request, pk=None):
        serializer = WikiBodySerializer(request.user, data=request.data, partial=True)
        serializer.save()
        serializer.is_valid(raise_exception=True)
        return Response(serializer.data)

    def get_queryset(self, *args, **kwargs):
        queryset_list = WikiArticle.objects.all()  # filter(user=self.request.user)
        query = self.request.GET.get("q")
        if query:
            queryset_list = queryset_list.filter(
                Q(body__icontains=query) | Q(id__icontains=query)).distinct()
        return queryset_list


class WikiArticleViewListOnlyViewSet(mixins.ListModelMixin, GenericViewSet):
    """
    API endpoint that allows Wikis to be viewed only. Note: Body and Body_html is not shown.
    This Endpoint includes Searching for Title or users.
    """
    serializer_class = WikiViewListOnlySerializer
    filter_backends = [SearchFilter, OrderingFilter]
    permission_classes = [IsAdminUser]
    search_fields = ['title', 'created_by__username']
    pagination_class = WikiPageNumberPagination

    def get_queryset(self, *args, **kwargs):
        queryset_list = WikiArticle.objects.all()
        query = self.request.GET.get("q")
        if query:
            queryset_list = queryset_list.filter(
                Q(title__icontains=query) |
                Q(created_by__username__icontains=query)
            ).distinct()
        return queryset_list
