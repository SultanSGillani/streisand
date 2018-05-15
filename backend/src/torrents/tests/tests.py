# -*- coding: utf-8 -*-

from django_dynamic_fixture import G

from django.test import TestCase
from django.utils.timezone import now

from torrents.models import Torrent
from torrent_stats.models import TorrentStats
from users.models import User

from www.tasks import handle_announce


class TorrentAnnounceTests(TestCase):

    def setUp(self):
        self.user = G(User)
        self.torrent = G(Torrent, uploaded_by=self.user)

    def upload(self, amount):
        handle_announce(
            announce_key=self.user.announce_key_id,
            torrent_info_hash=self.torrent.swarm_id,
            peer_id='baz',
            ip_address='0.0.0.0',
            port='1234',
            user_agent='',
            new_bytes_uploaded=amount,
            new_bytes_downloaded=0,
            bytes_remaining=0,
            event='',
            time_stamp=now(),
        )

    def test_announce_handler_tracks_uploaded_data(self):
        self.upload(100)
        stats = TorrentStats.objects.get(user=self.user, torrent=self.torrent)
        self.assertEqual(stats.bytes_uploaded, 100)
        self.upload(100)
        stats = TorrentStats.objects.get(user=self.user, torrent=self.torrent)
        self.assertEqual(stats.bytes_uploaded, 200)

    def test_successful_announce_is_logged(self):
        self.user.log_successful_announces = True
        self.user.save()
        self.upload(100)
        log = self.user.logged_announces.get()
        self.assertEqual(log.announce_key, self.user.announce_key_id)
        self.assertEqual(log.swarm_id, self.torrent.swarm_id)
        self.assertEqual(log.new_bytes_uploaded, 100)
        self.assertEqual(log.new_bytes_downloaded, 0)
        self.assertEqual(log.bytes_remaining, 0)
