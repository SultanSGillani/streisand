# -*- coding: utf-8 -*-

from django_filters import rest_framework as filters

from torrents.models import TorrentFile


class TorrentFilter(filters.FilterSet):

    uploaded_by = filters.CharFilter(field_name='uploaded_by__username', lookup_expr='icontains')
    moderated_by = filters.CharFilter(field_name='moderated_by__username', lookup_expr='icontains')
    film = filters.CharFilter(field_name='release__film__title', lookup_expr='icontains')
    film_id = filters.NumberFilter(field_name='release__film_id', lookup_expr='exact')
    release = filters.NumberFilter(field_name='release', lookup_expr='exact')

    class Meta:
        model = TorrentFile
        fields = (
            'id',
            'info_hash',
            'uploaded_at',
            'last_seeded',
            'snatch_count',
            'reseed_request',
            'is_approved',
        )

