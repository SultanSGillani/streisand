# -*- coding: utf-8 -*-

from django.db import models
from django.db.models import F
from django.urls import reverse

from comments.models import Comment

from .managers import VoteQuerySet


class TorrentRequest(models.Model):

    old_id = models.PositiveIntegerField(null=True, db_index=True)

    # Site information
    created_by = models.ForeignKey(
        to='users.User',
        null=True,
        related_name='torrent_requests',
        on_delete=models.SET_NULL,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    film_title = models.CharField(max_length=1024)
    film_year = models.PositiveSmallIntegerField(null=True)
    imdb = models.ForeignKey(
        to='imdb.FilmIMDb',
        null=True,
        on_delete=models.SET_NULL,
    )
    description = models.TextField()
    release_name = models.CharField(max_length=255)
    filling_torrent = models.ForeignKey(
        to='torrents.Torrent',
        null=True,
        related_name='requests_filled',
        on_delete=models.SET_NULL,
    )
    requester_followed_through = models.BooleanField(default=False)

    # Format information
    is_source = models.BooleanField(default=False)
    source_media = models.ForeignKey(
        to='media_formats.SourceMedia',
        null=True,
        related_name='torrent_requests',
        on_delete=models.SET_NULL,
    )
    resolution = models.ForeignKey(
        to='media_formats.Resolution',
        null=True,
        related_name='torrent_requests',
        on_delete=models.SET_NULL,
    )
    codec = models.ForeignKey(
        to='media_formats.Codec',
        null=True,
        related_name='torrent_requests',
        on_delete=models.SET_NULL,
    )
    container = models.ForeignKey(
        to='media_formats.Container',
        null=True,
        related_name='torrent_requests',
        on_delete=models.SET_NULL,
    )

    class Meta:
        permissions = (
            ('can_request', "Can make new torrent requests"),
        )

    def __str__(self):
        return 'Request for "{film_title}" ({year}) - {format}'.format(
            film_title=self.film_title,
            year=self.film_year,
            format=self.format,
        )

    def get_absolute_url(self):
        return reverse(
            viewname='torrent_request_details',
            kwargs={
                'torrent_request_id': self.id,
            }
        )

    @property
    def format(self):
        return '{codec} / {container} / {resolution} / {source_media}'.format(
            codec=self.codec_id or 'ANY',
            container=self.container_id or 'ANY',
            resolution=self.resolution_id or 'ANY',
            source_media=self.source_media_id or 'ANY',
        )

    @property
    def total_bounty_in_bytes(self):
        return self.votes.total_bounty_in_bytes()


class Vote(models.Model):

    author = models.ForeignKey(
        to='users.User',
        null=True,
        related_name='torrent_request_votes',
        on_delete=models.SET_NULL,
    )
    torrent_request = models.ForeignKey(
        to='torrent_requests.TorrentRequest',
        related_name='votes',
        on_delete=models.CASCADE,
    )
    bounty_in_bytes = models.BigIntegerField(default=0)

    objects = VoteQuerySet.as_manager()

    class Meta:
        unique_together = ('author', 'torrent_request')
        permissions = (
            ('can_vote', "Can vote on torrent requests"),
        )

    def __str__(self):
        return '{bounty} bytes bounty on {request} by {user}'.format(
            bounty=self.bounty_in_bytes,
            request=self.torrent_request,
            user=self.author,
        )

    def delete(self, *args, **kwargs):
        if self.author and self.bounty_in_bytes:
            # Refund the bounty to the author
            self.author.bytes_uploaded = F('bytes_uploaded') + self.bounty_in_bytes
            self.author.save(update_fields=['bytes_uploaded'])
        super().delete(*args, **kwargs)


class RequestComment(Comment):

    request = models.ForeignKey(
        to='torrent_requests.TorrentRequest',
        related_name='comments',
        on_delete=models.CASCADE,
    )
