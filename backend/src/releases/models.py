# -*- coding: utf-8 -*-

from django.db import models

from comments.models import Comment


class Release(models.Model):

    film = models.ForeignKey(
        to='films.Film',
        null=False,
        db_index=True,
        related_name='releases',
        on_delete=models.CASCADE,
    )
    cut = models.CharField(max_length=128, null=True, default=None)
    name = models.CharField(max_length=1024)
    group = models.CharField(max_length=32)
    is_scene = models.NullBooleanField(default=False)
    description = models.TextField()
    nfo = models.TextField()
    mediainfo = models.OneToOneField(
        to='mediainfo.Mediainfo',
        related_name='release',
        null=True,
        on_delete=models.PROTECT,
    )
    encoded_by = models.ForeignKey(
        to='users.User',
        null=True,
        related_name='encoded_releases',
        on_delete=models.PROTECT,
    )

    is_3d = models.BooleanField(default=False)
    is_source = models.BooleanField(default=False)
    source_media = models.ForeignKey(
        to='media_formats.SourceMedia',
        related_name='torrents',
        null=True,
        blank=False,
        on_delete=models.SET_NULL,
    )
    resolution = models.ForeignKey(
        to='media_formats.Resolution',
        related_name='torrents',
        null=True,
        blank=False,
        on_delete=models.SET_NULL,
    )
    codec = models.ForeignKey(
        to='media_formats.Codec',
        related_name='torrents',
        null=True,
        blank=False,
        on_delete=models.SET_NULL,
    )
    container = models.ForeignKey(
        to='media_formats.Container',
        related_name='torrents',
        null=True,
        blank=False,
        on_delete=models.SET_NULL,
    )

    def __str__(self):
        return '{release_name}'.format(
            release_name=self.name,
        )

    @property
    def format(self):
        return '{codec} / {container} / {resolution} / {source_media}'.format(
            codec=self.codec_id,
            container=self.container_id,
            resolution=self.resolution_id,
            source_media=self.source_media_id,
        )


class ReleaseComment(Comment):
    release = models.ForeignKey(
        to='releases.Release',
        related_name='comments',
        on_delete=models.CASCADE,
    )
