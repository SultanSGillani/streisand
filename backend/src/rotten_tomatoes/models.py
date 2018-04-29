# -*- coding: utf-8 -*-

from django.db import models
from django.utils.timezone import now

from .managers import FilmRottenTomatoesManager


class FilmRottenTomatoes(models.Model):

    id = models.PositiveIntegerField(primary_key=True)
    url = models.URLField()
    title = models.CharField(max_length=1024)
    year = models.PositiveSmallIntegerField(null=True)
    critics_rating = models.PositiveSmallIntegerField(null=True)
    critics_rating_string = models.CharField(max_length=32)
    audience_rating = models.PositiveSmallIntegerField(null=True)
    audience_rating_string = models.CharField(max_length=32)
    runtime_in_minutes = models.PositiveSmallIntegerField(null=True)
    last_updated = models.DateTimeField(null=True)

    objects = FilmRottenTomatoesManager()

    def __str__(self):
        if self.title and self.year:
            return '{title} ({year}) - {url}'.format(
                title=self.title,
                year=self.year,
                url=self.url,
            )
        else:
            return self.url

    def refresh_from_api(self):

        metadata = FilmRottenTomatoesManager.get_metadata(rt_id=self.id)

        self.url = metadata['url']
        self.title = metadata['title']
        self.year = metadata['year']
        self.critics_rating = metadata['critics_rating']
        self.critics_rating_string = metadata['critics_rating_string']
        self.audience_rating = metadata['audience_rating']
        self.audience_rating_string = metadata['audience_rating_string']
        self.runtime_in_minutes = metadata['runtime_in_minutes']
        self.last_updated = now()
        self.save()
