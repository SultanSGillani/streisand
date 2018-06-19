# -*- coding: utf-8 -*-

from django.db.models import Q

from rest_framework import mixins
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import GenericViewSet

from wiki.models import WikiArticle

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
    permission_classes = [IsAuthenticated]
    search_fields = ['title', 'created_by__username', 'read_access_minimum_user_class__username__userclass']

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user
                        )

    def perform_partial_update(self, serializer, **kwargs):
        kwargs['partial'] = True
        serializer.save(modified_by=self.request.user)

    def perform_update(self, serializer):
        serializer.save(modified_by=self.request.user)

    def get_queryset(self, *args, **kwargs):
        queryset_list = WikiArticle.objects.all()
        query = self.request.GET.get("q")
        if query:
            queryset_list = queryset_list.filter(
                Q(title__icontains=query) |
                Q(created_by__username__contains=query) |
                Q(read_access_minimum_user_class__username__userclass__icontains=query)
            ).distinct()
        return queryset_list


class WikiArticleBodyViewSet(mixins.RetrieveModelMixin, mixins.UpdateModelMixin, GenericViewSet):
    """
    API endpoint that allows Wiki Body and body ID to be viewed, or Patched only.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = WikiBodySerializer
    search_fields = ['body', 'id']

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user
                        )

    def perform_partial_update(self, serializer, **kwargs):
        kwargs['partial'] = True
        serializer.save(modified_by=self.request.user)

    def perform_update(self, serializer):
        serializer.save(modified_by=self.request.user)

    def get_queryset(self, *args, **kwargs):
        queryset_list = WikiArticle.objects.all()
        query = self.request.GET.get("q")
        if query:
            queryset_list = queryset_list.filter(
                Q(body__icontains=query) | Q(id=query)).distinct()
        return queryset_list


class WikiArticleViewListOnlyViewSet(mixins.ListModelMixin, GenericViewSet):
    """
    API endpoint that allows Wikis to be viewed only. Note: Body and Body_html is not shown.
    This Endpoint includes Searching for Title or users.
    """
    serializer_class = WikiViewListOnlySerializer
    filter_backends = [SearchFilter, OrderingFilter]
    permission_classes = [IsAuthenticated]
    search_fields = ['title', 'created_by__username']

    def get_queryset(self, *args, **kwargs):
        queryset_list = WikiArticle.objects.all()
        query = self.request.GET.get("q")
        if query:
            queryset_list = queryset_list.filter(
                Q(title__icontains=query) |
                Q(created_by__username__contains=query)
            ).distinct()
        return queryset_list
