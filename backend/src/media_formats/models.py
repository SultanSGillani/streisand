# -*- coding: utf-8 -*-

from django.db import models


class MediaFormat(models.Model):

    name = models.CharField(max_length=64, primary_key=True)

    class Meta:
        abstract = True

    def __str__(self):
        return '{name}'.format(name=self.name)


class Codec(MediaFormat):
    pass


class Container(MediaFormat):
    pass


class Resolution(MediaFormat):
    pass


class SourceMedia(MediaFormat):
    pass
