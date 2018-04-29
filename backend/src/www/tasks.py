# -*- coding: utf-8 -*-

from celery import shared_task

from django.conf import settings
from django.db.models import F
from django.utils.timezone import timedelta

from torrents.models import Torrent
from torrent_stats.models import TorrentStats
from users.models import User, UserIPAddress

from .utils import email


@shared_task
def async_email(*args, **kwargs):
    """
    Email wrapper for Celery
    """
    email(*args, **kwargs)


@shared_task
def handle_announce(announce_key, torrent_info_hash, new_bytes_uploaded, new_bytes_downloaded,
                    bytes_remaining, event, ip_address, port, peer_id, user_agent, time_stamp):
    """
    Event handler for announces made to the tracker.

    Updates torrent stats and IP address history, using Django F expressions to
    avoid concurrency problems.  If announce logging is turned on for this user,
    this handler logs all the announce info.
    """

    try:
        # Get everything in one query, if it exists
        torrent_stats = TorrentStats.objects.filter(
            user__announce_key_id=announce_key,
            torrent__swarm_id=torrent_info_hash,
        ).select_related(
            'user',
            'torrent',
        ).get()
    except TorrentStats.DoesNotExist:
        user = User.objects.get(announce_key_id=announce_key)
        torrent = Torrent.objects.get(swarm_id=torrent_info_hash)
        torrent_stats = TorrentStats.objects.create(
            user=user,
            torrent=torrent,
        )
    else:
        user = torrent_stats.user
        torrent = torrent_stats.torrent

    if bytes_remaining == 0 and event != 'stopped':

        # Track seeding times
        threshold = time_stamp - (settings.TRACKER_ANNOUNCE_INTERVAL * 1.1)
        if torrent_stats.last_seeded and time_stamp > torrent_stats.last_seeded >= threshold:
            torrent_stats.seed_time += (time_stamp - torrent_stats.last_seeded)

        # Track last seeded timestamp
        torrent_stats.last_seeded = time_stamp
        torrent.last_seeded = time_stamp
        user.last_seeded = time_stamp

        # Resolve reseed requests
        if torrent.reseed_request_id:
            torrent.reseed_requests.filter(id=torrent.reseed_request_id).update(fulfilled_at=time_stamp)
            torrent.reseed_request = None

    if bytes_remaining == 0:
        percent_completed = 100
    else:
        percent_completed = 100 * (torrent.size_in_bytes - bytes_remaining) / torrent.size_in_bytes

    # Track HNRs
    if (torrent_stats.is_hit_and_run is not False) and (percent_completed >= 90):
        two_weeks_ago = time_stamp - timedelta(days=14)
        if torrent_stats.hnr_countdown_started_at is None:
            torrent_stats.hnr_countdown_started_at = time_stamp
        elif torrent_stats.hnr_countdown_started_at < two_weeks_ago:
            torrent_stats.is_hit_and_run = torrent_stats.seed_time < timedelta(hours=96)

    # Track snatches
    if event == 'completed':
        torrent.snatch_count = F('snatch_count') + 1
        torrent_stats.snatch_count = F('snatch_count') + 1
        torrent_stats.last_snatched = time_stamp

        if torrent_stats.first_snatched is None:
            torrent_stats.first_snatched = time_stamp

    # Track upload/download stats
    torrent_stats.bytes_uploaded = F('bytes_uploaded') + new_bytes_uploaded
    torrent_stats.bytes_downloaded = F('bytes_downloaded') + new_bytes_downloaded
    user.bytes_downloaded = F('bytes_downloaded') + new_bytes_downloaded
    user.bytes_uploaded = F('bytes_uploaded') + new_bytes_uploaded

    # Save changes
    torrent_stats.save()
    torrent.save()
    user.save()

    # Update the user's IP history
    UserIPAddress.objects.update_or_create(
        user=user,
        ip_address=ip_address,
        used_with='tracker',
    )

    # Announce logging
    if user.log_successful_announces:
        user.logged_announces.create(
            time_stamp=time_stamp,
            swarm_id=torrent_info_hash,
            announce_key=announce_key,
            ip_address=ip_address,
            port=port,
            peer_id=peer_id,
            user_agent=user_agent,
            new_bytes_downloaded=new_bytes_downloaded,
            new_bytes_uploaded=new_bytes_uploaded,
            bytes_remaining=bytes_remaining,
            event=event,
        )
