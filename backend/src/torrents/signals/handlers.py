# -*- coding: utf-8 -*-

from django.db.models.signals import post_save
from django.dispatch import receiver

from tracker.models import Swarm


@receiver(post_save, sender='torrents.TorrentFile')
def handle_new_torrent_file(**kwargs):

    if kwargs['created']:
        # Create a Swarm
        Swarm.objects.create(torrent=kwargs['instance'])
