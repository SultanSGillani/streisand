# -*- coding: utf-8 -*-

from django.db import models
from django.urls import reverse

from comments.models import Comment
from rotten_tomatoes.models import FilmRottenTomatoes
from users.models import User


class Film(models.Model):
    old_id = models.PositiveIntegerField(null=True, db_index=True)

    title = models.CharField(max_length=1024)
    year = models.PositiveSmallIntegerField(null=False)
    imdb = models.ForeignKey(
        to='imdb.FilmIMDb',
        null=True,
        on_delete=models.SET_NULL,
    )
    rotten_tomatoes = models.ForeignKey(
        to='rotten_tomatoes.FilmRottenTomatoes',
        null=True,
        on_delete=models.SET_NULL,
    )
    tmdb_id = models.IntegerField(null=True, unique=True)
    poster_url = models.URLField()
    fanart_url = models.URLField(blank=True)
    trailer_url = models.URLField()
    trailer_type = models.CharField(max_length=64)
    duration_in_minutes = models.IntegerField(null=True)
    description = models.TextField()
    moderation_notes = models.TextField(blank=True)
    genre_tags = models.ManyToManyField('media_formats.Genre', related_name='films', blank=True)

    def __str__(self):
        return '{title} ({year})'.format(title=self.title, year=self.year)

    def get_absolute_url(self):
        return reverse('film_details', args=[self.id])

    @staticmethod
    def autocomplete_search_fields():
        return (
            "title__icontains",
        )

    def fetch_rotten_tomatoes_info(self):
        if self.rotten_tomatoes:
            self.rotten_tomatoes.refresh_from_api()
        elif self.imdb:
            self.rotten_tomatoes = FilmRottenTomatoes.objects.create_from_imdb_tt_id(self.imdb.tt_id)
            self.save()


class FilmComment(Comment):
    film = models.ForeignKey(
        to='films.Film',
        related_name='comments',
        on_delete=models.CASCADE,
    )


class Tag(models.Model):
    name = models.CharField(max_length=32, primary_key=True)

    def __str__(self):
        return self.name


class Collection(models.Model):
    creator = models.ForeignKey(User, on_delete=models.PROTECT, null=True, related_name='collection_creators')
    created_at = models.DateTimeField(auto_now_add=True)
    title = models.CharField(max_length=1024)
    description = models.TextField()
    films = models.ManyToManyField(Film, related_name='lists')

    def __str__(self):
        return self.title

    def get_absolute_url(self):
        return reverse('collection-detail', args=[self.id])


class CollectionComment(Comment):
    collection = models.ForeignKey(
        to='films.Collection',
        related_name='comments',
        on_delete=models.CASCADE,
    )
