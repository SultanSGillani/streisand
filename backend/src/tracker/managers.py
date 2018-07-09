# -*- coding: utf-8 -*-

from binascii import a2b_base64
from random import sample

from django.conf import settings
from django.core.cache import cache
from django.db import models
from django.utils.timezone import now


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
        https://wiki.theory.org/index.php/BitTorrentSpecification#Tracker_Response
        """
        peer_list = list(self.values_list('compact_representation', flat=True))
        peer_list = sample(peer_list, min(limit, len(peer_list)))
        return a2b_base64(''.join(peer_list))

    def dictionary(self, limit):
        """
        Returns a list of peer dictionaries, selected randomly from the queryset,
        up to the provided limit.
        https://wiki.theory.org/index.php/BitTorrentSpecification#Tracker_Response
        """
        peer_list = [peer.dictionary_representation for peer in self.distinct('ip_address', 'port')]
        peer_list = sample(peer_list, min(limit, len(peer_list)))
        return peer_list


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
