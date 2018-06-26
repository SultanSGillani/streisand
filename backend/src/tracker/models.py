# -*- coding: utf-8 -*-

from uuid import uuid4

from django.db import models

from .managers import PeerQuerySet, TorrentClientManager, SwarmManager


class Swarm(models.Model):

    torrent = models.OneToOneField(
        to='torrents.TorrentFile',
        to_field='info_hash',
        related_name='swarm',
        primary_key=True,
        on_delete=models.CASCADE,
    )

    objects = SwarmManager()

    class Meta:
        permissions = (
            ('can_leech', "Can receive peer lists from the tracker"),
        )

    def __str__(self):
        return self.torrent_id

    def __repr__(self):
        return self.__str__()


class Peer(models.Model):
    """
    A peer in a particular torrent swarm.
    """

    # Because Django does not support compound primary keys, and because this
    # table might actually hit the max limit of an auto-incrementing integer ID,
    # we use an auto-generated UUIDField as the primary key.
    id = models.UUIDField(default=uuid4, primary_key=True, editable=False)

    swarm = models.ForeignKey(
        to='tracker.Swarm',
        db_index=True,
        related_name='peers',
        null=False,
        on_delete=models.CASCADE,
    )
    user_announce_key = models.CharField(max_length=36, null=False, db_index=True)
    ip_address = models.GenericIPAddressField(null=False)
    port = models.IntegerField(null=False)
    peer_id = models.CharField(max_length=40, null=False)
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
    last_announce = models.DateTimeField(auto_now=True)

    objects = PeerQuerySet.as_manager()

    class Meta:
        # If a client restarts, all of these might be the same, except for peer_id
        unique_together = ['swarm', 'user_announce_key', 'ip_address', 'port', 'peer_id']
        index_together = ['swarm', 'user_announce_key', 'ip_address', 'port', 'peer_id']

    def __str__(self):
        return '{ip}:{port}'.format(
            ip=self.ip_address,
            port=self.port,
        )

    def __repr__(self):
        return 'Peer <{peer}>'.format(peer=self.__str__())


class TorrentClient(models.Model):

    peer_id_prefix = models.CharField(max_length=20, primary_key=True, null=False, blank=False)
    name = models.CharField(max_length=128, null=False, blank=False)
    is_whitelisted = models.NullBooleanField(db_index=True)
    notes = models.TextField(null=True, blank=True)

    objects = TorrentClientManager()

    def __str__(self):
        return self.name
