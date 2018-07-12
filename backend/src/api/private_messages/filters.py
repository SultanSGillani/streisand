# -*- coding: utf-8 -*-

from django_filters import rest_framework as filters

from private_messages.models import Message


class MessageFilter(filters.FilterSet):
    subject = filters.CharFilter(field_name='subject', lookup_expr='icontains')
    body = filters.CharFilter(field_name='body', lookup_expr='icontains')

    # This should always be null in an initial message.
    has_replies = filters.BooleanFilter(
        field_name='parent', lookup_expr='isnull'
    )

    class Meta:
        model = Message
        fields = {
            'id': ['in'],
            'tree_id': ['exact', 'in'],
            'sender__username': ['exact', 'in', 'startswith', 'icontains'],
            'recipient__username': ['exact', 'in', 'startswith', 'icontains'],
            'deleted_outbox': ['exact'],
            'deleted_inbox': ['exact'],
        }


class MessageReplyFilter(filters.FilterSet):
    subject = filters.CharFilter(
        field_name='parent__subject', lookup_expr='icontains'
    )
    body = filters.CharFilter(field_name='body', lookup_expr='icontains')

    class Meta:
        model = Message
        fields = {
            'id': ['in'],
            'parent_id': ['exact', 'in'],
            'tree_id': ['exact', 'in'],
            'sender__username': ['exact', 'in', 'startswith', 'icontains'],
            'recipient__username': ['exact', 'in', 'startswith', 'icontains']
        }
