# -*- coding: utf-8 -*-

from django_filters import rest_framework as filters

from films.models import Film, Collection


class FilmFilter(filters.FilterSet):
    title = filters.CharFilter(field_name='title', lookup_expr='icontains')
    description = filters.CharFilter(
        field_name='description', lookup_expr='icontains')
    genre = filters.CharFilter(field_name='genre_tags')

    class Meta:
        model = Film
        fields = (
            'title',
            'description',
            'genre_tags',
            'year',
        )


class CollectionFilter(filters.FilterSet):
    class Meta:
        model = Collection
        fields = {
            'films__id': ['in'],
            'films__title': ['exact', 'in', 'startswith', 'contains'],
            'creator__username': ['exact', 'in', 'startswith'],
            'title': ['exact', 'in', 'startswith'],
        }
