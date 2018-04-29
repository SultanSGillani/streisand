# -*- coding: utf-8 -*-

from django.contrib import admin

from .models import Film


class FilmAdmin(admin.ModelAdmin):

    fields = (
        'title',
        'year',
        'tmdb_id',
        'poster',
        'fanart_url',
        'trailer_url',
        'trailer_type',
        'duration_in_minutes',
        'description',
    )

    readonly_fields = fields

    list_display = (
        'title',
        'year',
        'duration_in_minutes',
    )

    search_fields = (
        'title',
        'year',
        'imdb_id',
    )

    def poster(self, film):
        return '<img src="{poster_url}" />'.format(
            poster_url=film.poster_url,
        )
    poster.allow_tags = True


admin.site.register(Film, FilmAdmin)
