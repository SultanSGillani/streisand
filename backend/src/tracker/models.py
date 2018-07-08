# -*- coding: utf-8 -*-

from uuid import uuid4

from django.conf import settings
from django.db import models
from django.utils.timezone import now

from .managers import PeerQuerySet, TorrentClientManager


class Peer(models.Model):
    """
    A peer in a particular torrent swarm.
    """

    # Because Django does not support compound primary keys, and because this
    # table might actually hit the max limit of an auto-incrementing integer ID,
    # we use an auto-generated UUIDField as the primary key.
    id = models.UUIDField(default=uuid4, primary_key=True, editable=False)

    torrent = models.ForeignKey(
        to='torrents.TorrentFile',
        db_index=True,
        related_name='peers',
        null=False,
        on_delete=models.CASCADE,
    )
    user = models.ForeignKey(
        to='users.User',
        db_index=True,
        related_name='peers',
        null=False,
        on_delete=models.CASCADE,
    )
    announce_key = models.ForeignKey(
        to='users.UserAnnounceKey',
        db_index=True,
        related_name='peers',
        null=False,
        on_delete=models.CASCADE,
    )
    ip_address = models.GenericIPAddressField(null=False, protocol='IPv4')
    port = models.IntegerField(null=False)
    peer_id = models.CharField(max_length=60, null=False)
    user_agent = models.TextField()
    compact_representation = models.CharField(
        null=False,
        max_length=10,
        help_text="base64 encoded compact representation, sent as bytes to announcing torrent clients"
    )

    # These are checked by the tracker when the client announces again, to decide
    # whether the user has uploaded/downloaded bytes since the previous announce
    bytes_uploaded = models.BigIntegerField(default=0, null=False)
    bytes_downloaded = models.BigIntegerField(default=0, null=False)

    bytes_remaining = models.BigIntegerField(null=False)
    complete = models.BooleanField(default=False, null=False)

    first_announce = models.DateTimeField(auto_now_add=True)
    last_announce = models.DateTimeField(auto_now=True, db_index=True)

    objects = PeerQuerySet.as_manager()

    class Meta:
        unique_together = ['torrent', 'ip_address', 'port']
        index_together = ['torrent', 'ip_address', 'port']

    def __str__(self):
        return '{ip}:{port}'.format(
            ip=self.ip_address,
            port=self.port,
        )

    def __repr__(self):
        return 'Peer <{peer}>'.format(peer=self.__str__())

    @property
    def dictionary_representation(self):
        return {
            'peer id': self.peer_id,
            'ip': self.ip_address,
            'port': self.port,
        }

    @property
    def is_active(self):
        return self.last_announce > now() - (settings.TRACKER_ANNOUNCE_INTERVAL * 2)


class TorrentClient(models.Model):

    peer_id_prefix = models.CharField(max_length=20, primary_key=True, null=False, blank=False)
    name = models.CharField(max_length=128, null=False, blank=False)
    is_whitelisted = models.NullBooleanField(db_index=True)
    notes = models.TextField(null=True, blank=True)

    objects = TorrentClientManager()

    def __str__(self):
        return self.name
