# -*- coding: utf-8 -*-

from binascii import a2b_base64
from random import sample

from django.conf import settings
from django.core.cache import cache
from django.db import models
from django.utils.timezone import now


class SwarmManager(models.Manager):

    PEER_LIST_CACHE_KEY = 'swarm_peers_{info_hash}'

    def get_peer_list(self, info_hash):

        cache_key = self.PEER_LIST_CACHE_KEY.format(info_hash=info_hash)

        # Try to fetch the queryset from cache
        peer_list = cache.get(cache_key)

        if peer_list is None:

            # Get the peer list from the database, and cache it
            swarm = self.get(torrent_id=info_hash)
            peer_list = swarm.peers.all()
            cache.set(cache_key, peer_list)

        return peer_list


class PeerQuerySet(models.QuerySet):

    def seeders(self):
        return self.filter(complete=True)

    def leechers(self):
        return self.filter(complete=False)

    def active(self):
        return self.filter(last_announce__gt=now() - (settings.TRACKER_ANNOUNCE_INTERVAL * 2))

    def compact(self, limit):
        """
        Returns a compact (6-byte) representation of peers, selected randomly from
        the queryset, up to the provided limit.
        """
        peer_list = list(self.values_list('compact_representation', flat=True).distinct('ip_address', 'port'))
        peer_list = sample(peer_list, min(limit, len(peer_list)))
        return a2b_base64(''.join(peer_list))


class TorrentClientManager(models.Manager):

    WHITELIST_CACHE_KEY = 'client_whitelist'

    def get_whitelist(self):

        # Try to fetch the whitelist from cache
        client_whitelist = cache.get(self.WHITELIST_CACHE_KEY)

        if client_whitelist is None:

            # Create the whitelist from the database, and cache it
            client_whitelist = tuple(
                self.filter(is_whitelisted=True).values_list('peer_id_prefix', flat=True)
            )
            # Cache the whitelist for one hour
            cache.set(self.WHITELIST_CACHE_KEY, client_whitelist, 3600)

        return client_whitelist
