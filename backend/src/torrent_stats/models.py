# -*- coding: utf-8 -*-

from datetime import timedelta
from uuid import uuid4

from django.conf import settings
from django.db import models

from www.utils import ratio


class TorrentStats(models.Model):

    # Because Django does not support compound primary keys, and because this
    # table might actually hit the max limit of an auto-incrementing integer ID,
    # we use an auto-generated UUIDField as the primary key.
    id = models.UUIDField(default=uuid4, primary_key=True, editable=False)

    user = models.ForeignKey(
        to='users.User',
        null=False,
        related_name='torrent_stats',
        on_delete=models.CASCADE,
    )
    torrent = models.ForeignKey(
        to='torrents.TorrentFile',
        to_field='info_hash',
        null=False,
        related_name='torrent_stats',
        on_delete=models.CASCADE,
    )

    bytes_uploaded = models.BigIntegerField(default=0)
    bytes_downloaded = models.BigIntegerField(default=0)

    first_snatched = models.DateTimeField(null=True)
    last_snatched = models.DateTimeField(null=True, db_index=True)
    snatch_count = models.IntegerField(default=0, db_index=True)

    last_seeded = models.DateTimeField(null=True)
    seed_time = models.DurationField(default=timedelta(minutes=0))

    hnr_countdown_started_at = models.DateTimeField(null=True, default=None)
    is_hit_and_run = models.NullBooleanField(default=None)

    class Meta:
        unique_together = ['user', 'torrent']
        index_together = ['user', 'torrent']

    def __str__(self):
        return 'Torrent stats for {user} on {torrent}'.format(
            user=self.user,
            torrent=self.torrent,
        )

    @property
    def ratio(self):
        return ratio(self.bytes_uploaded, self.bytes_downloaded)

    @property
    def seed_time_remaining(self):
        if self.seed_time < settings.SEED_TIME_QUOTA:
            return (settings.SEED_TIME_QUOTA - self.seed_time)
        else:
            return None
