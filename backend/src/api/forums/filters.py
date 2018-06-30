# -*- coding: utf-8 -*-

from django_filters import rest_framework as filters

from forums.models import ForumGroup, ForumTopic, ForumThread


class ForumGroupFilter(filters.FilterSet):
    name = filters.CharFilter(field_name='name', lookup_expr='icontains')
    topic_name = filters.CharFilter(field_name='topics__name', lookup_expr='icontains')
    thread_title = filters.CharFilter(field_name='topics__threads__title', lookup_expr='icontains')
    post_body = filters.CharFilter(field_name='topics__threads__posts__body', lookup_expr='icontains')

    class Meta:
        model = ForumGroup
        fields = (
            'name',
        )


class ForumTopicFilter(filters.FilterSet):
    name = filters.CharFilter(field_name='name', lookup_expr='icontains')
    description = filters.CharFilter(field_name='description', lookup_expr='icontains')
    thread_title = filters.CharFilter(field_name='threads__title', lookup_expr='icontains')
    thread_id = filters.NumberFilter(field_name='threads__id', lookup_expr='exact')
    post_body = filters.CharFilter(field_name='threads__posts__body', lookup_expr='icontains')

    class Meta:
        model = ForumTopic
        fields = {
            'group_id': ['in', 'exact'],
        }


class ForumThreadFilter(filters.FilterSet):
    title = filters.CharFilter(field_name='title', lookup_expr='icontains')
    topic_name = filters.CharFilter(field_name='topic__name', lookup_expr='icontains')
    post_body = filters.CharFilter(field_name='posts__body', lookup_expr='icontains')

    class Meta:
        model = ForumThread
        fields = {
            'topic_id': ['in', 'exact'],
        }
