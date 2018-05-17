from django.db.models import Q

from rest_framework.filters import (
    SearchFilter,
    OrderingFilter,
)
from dry_rest_permissions.generics import DRYPermissions
from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets

from api.pagination import WikiPageNumberPagination
from api.mixins import MultiSerializerViewSetMixin

from wiki.models import WikiArticle
from . import serializers


class WikiViewSet(MultiSerializerViewSetMixin, viewsets.ModelViewSet):
    """
    API endpoint for managing wiki articles
    """
    serializer_class = serializers.WikiDetailSererializer
    serializer_action_classes = {
        'list': serializers.WikiListSerializer
    }

    filter_backends = [SearchFilter, OrderingFilter]
    permission_classes = [IsAuthenticated, DRYPermissions]
    search_fields = ['title', 'created_by__username']
    pagination_class = WikiPageNumberPagination  # PageNumberPagination

    def get_queryset(self, *args, **kwargs):
        queryset_list = WikiArticle.objects.accessible_to_user(self.request.user)
        query = self.request.GET.get("q")
        if query:
            queryset_list = queryset_list.filter(
                Q(title__icontains=query) |
                Q(created_by__username__icontains=query) |
                Q(read_access_minimum_user_class__username__userclass__icontains=query)
            ).distinct()
        return queryset_list

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    def perform_update(self, serializer):
        serializer.save(modified_by=self.request.user)
