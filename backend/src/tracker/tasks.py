# -*- coding: utf-8 -*-

from django.conf import settings
from django.utils.timezone import now

from celery import shared_task

from .models import Peer


@shared_task
def purge_dead_peers():
    """
    Clear out old peer records.  These might exist because of an un-graceful client shutdown,
    or a loss of internet connectivity.
    """
    Peer.objects.filter(
        last_announce__lt=now() - settings.DEAD_PEER_GRACE_PERIOD
    ).delete()
