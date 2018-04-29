# -*- coding: utf-8 -*-

from django.db import models
from django.utils.timezone import now

from .managers import FilmIMDbManager


class FilmIMDb(models.Model):

    id = models.PositiveIntegerField(primary_key=True)
    title = models.CharField(max_length=1024)
    year = models.PositiveSmallIntegerField(null=True)
    description = models.TextField()
    rating = models.DecimalField(decimal_places=1, max_digits=3, null=True)
    rating_vote_count = models.PositiveIntegerField(null=True)
    runtime_in_minutes = models.PositiveSmallIntegerField(null=True)
    last_updated = models.DateTimeField(null=True)

    objects = FilmIMDbManager()

    def __str__(self):
        if self.title and self.year:
            return '{title} ({year}) - {link}'.format(
                title=self.title,
                year=self.year,
                link=self.url,
            )
        else:
            return self.url

    @property
    def tt_id(self):
        return 'tt' + str(self.id).zfill(7)

    @property
    def url(self):
        return FilmIMDbManager.url_for_id(tt_id=self.tt_id)

    def refresh_from_imdb(self):

        metadata = FilmIMDbManager.get_metadata_for_tt_id(self.tt_id)

        self.title = metadata['title']
        self.year = metadata['year']
        self.description = metadata['description']
        self.rating = metadata['rating']
        self.rating_vote_count = metadata['rating_vote_count']
        self.runtime_in_minutes = metadata['runtime_in_minutes']
        self.last_updated = now()
        self.save()
