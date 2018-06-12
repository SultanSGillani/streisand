# -*- coding: utf-8 -*-

from django_filters import rest_framework as filters

from releases.models import Release


class ReleaseFilter(filters.FilterSet):

    encoded_by = filters.CharFilter(field_name='encoded_by__username', lookup_expr='iexact')
    film = filters.CharFilter(field_name='film__title', lookup_expr='icontains')
    film_id = filters.NumberFilter(field_name='film_id', lookup_expr='exact')

    class Meta:
        model = Release
        fields = (
            'id',
            'name',
            'group',
        )
