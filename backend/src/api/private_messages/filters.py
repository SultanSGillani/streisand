# -*- coding: utf-8 -*-

from django_filters import rest_framework as filters

from private_messages.models import Message


class MessageFilter(filters.FilterSet):
    is_superuser = filters.BooleanFilter(field_name='sender__is_superuser')
    subject = filters.CharFilter(field_name='subject', lookup_expr='icontains')
    body = filters.CharFilter(field_name='body', lookup_expr='icontains')

    class Meta:
        model = Message
        fields = {
            'id': ['in'],
            'tree_id': ['exact', 'in'],
            'sender__username': ['exact', 'in', 'startswith', 'icontains'],
            'recipient__username': ['exact', 'in', 'startswith'],
            'parent__children': ['exact', 'in', 'startswith'],
        }

