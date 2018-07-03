# -*- coding: utf-8 -*-

from binascii import a2b_base64, a2b_hex
from unittest.mock import patch, ANY
from urllib.parse import urlencode

from django_dynamic_fixture import G

from django.test import TestCase, RequestFactory

from users.models import User
from torrents.models import TorrentFile

from tracker.bencoding import bdecode
from tracker.models import Swarm, Peer, TorrentClient
from tracker.views import AnnounceView


@patch('tracker.views.handle_announce.delay')
class AnnounceTests(TestCase):

    def setUp(self):
        self.factory = RequestFactory()
        self.announce_view = AnnounceView.as_view()
        self.user = G(User)
        self.torrent = G(TorrentFile, pieces='', directory_name='', files=[])
        G(TorrentClient, peer_id_prefix='-DE1360-', is_whitelisted=True)
        self.swarm = G(Swarm, torrent=self.torrent)
        for i in range(10):
            G(
                Peer,
                swarm=self.swarm,
                port=5000 + i,
                ip_address='127.0.0.1',
                peer_id='-DE1360-xxxxxxxxxxxx',
                user_announce_key=self.user.announce_key_id,
            )
        self.announce_data = {
            'info_hash': a2b_hex(self.swarm.torrent_id),
            'peer_id': '-DE1360-xxxxxxxxxxxx',
            'uploaded': '123',
            'downloaded': '456',
            'left': '789',
            'port': '5000',
        }

    def announce_request(self):
        """
        Hack so we can urlencode raw bytes (torrent info_hash)
        """
        return self.factory.get(
            path='/?{params}'.format(
                params=urlencode(self.announce_data)
            ),
            HTTP_USER_AGENT='foobar',
        )

    def test_announce_handler_called_with_correct_arguments(self, handler_mock):
        request = self.announce_request()
        self.announce_view(request, announce_key=self.user.announce_key_id)
        handler_mock.assert_called_once_with(
            announce_key=self.user.announce_key_id,
            torrent_info_hash=self.swarm.torrent_id,
            new_bytes_uploaded=123,
            new_bytes_downloaded=456,
            total_bytes_uploaded=123,
            total_bytes_downloaded=456,
            bytes_remaining=789,
            event='',
            ip_address='127.0.0.1',
            port=5000,
            peer_id='-DE1360-xxxxxxxxxxxx',
            user_agent='foobar',
            time_stamp=ANY,
            suspicious_behaviors=None,
        )

    def test_announce_handler_called_with_suspicious_behaviors(self, handler_mock):
        self.announce_data['event'] = 'completed'
        request = self.announce_request()
        self.announce_view(request, announce_key=self.user.announce_key_id)
        handler_mock.assert_called_once_with(
            announce_key=self.user.announce_key_id,
            torrent_info_hash=self.swarm.torrent_id,
            new_bytes_uploaded=123,
            new_bytes_downloaded=456,
            total_bytes_uploaded=123,
            total_bytes_downloaded=456,
            bytes_remaining=789,
            event='completed',
            ip_address='127.0.0.1',
            port=5000,
            peer_id='-DE1360-xxxxxxxxxxxx',
            user_agent='foobar',
            time_stamp=ANY,
            suspicious_behaviors=["Bytes left is non-zero for 'completed' event."],
        )

    def test_announce_handler_not_called__bad_announce_key(self, handler_mock):
        request = self.announce_request()
        self.announce_view(request, announce_key='ffffffff-ffff-ffff-ffff-ffffffffffff')
        self.assertEqual(handler_mock.call_count, 0)

    def test_announce_handler_not_called__bad_info_hash(self, handler_mock):
        self.announce_data.update({'info_hash': 'ffffffffffffffffffff'})
        request = self.announce_request()
        self.announce_view(request, announce_key=self.user.announce_key_id)
        self.assertEqual(handler_mock.call_count, 0)

    def test_announce_handler_not_called__non_compact(self, handler_mock):
        self.announce_data.update({'compact': '0'})
        request = self.announce_request()
        self.announce_view(request, announce_key=self.user.announce_key_id)
        self.assertEqual(handler_mock.call_count, 0)

    def test_announce_handler_not_called__non_whitelisted_peer_id(self, handler_mock):
        self.announce_data.update({'peer_id': '-FFFFFF-FFFFFFFFFFFF'})
        request = self.announce_request()
        self.announce_view(request, announce_key=self.user.announce_key_id)
        self.assertEqual(handler_mock.call_count, 0)

    def test_announce_handler_not_called__missing_info_hash(self, handler_mock):
        del self.announce_data['info_hash']
        request = self.announce_request()
        self.announce_view(request, announce_key=self.user.announce_key_id)
        self.assertEqual(handler_mock.call_count, 0)

    def test_announce_handler_not_called__missing_peer_id(self, handler_mock):
        del self.announce_data['peer_id']
        request = self.announce_request()
        self.announce_view(request, announce_key=self.user.announce_key_id)
        self.assertEqual(handler_mock.call_count, 0)

    def test_announce_handler_not_called__missing_port(self, handler_mock):
        del self.announce_data['port']
        request = self.announce_request()
        self.announce_view(request, announce_key=self.user.announce_key_id)
        self.assertEqual(handler_mock.call_count, 0)

    def test_announce_handler_not_called__missing_uploaded(self, handler_mock):
        del self.announce_data['uploaded']
        request = self.announce_request()
        self.announce_view(request, announce_key=self.user.announce_key_id)
        self.assertEqual(handler_mock.call_count, 0)

    def test_announce_handler_not_called__missing_downloaded(self, handler_mock):
        del self.announce_data['downloaded']
        request = self.announce_request()
        self.announce_view(request, announce_key=self.user.announce_key_id)
        self.assertEqual(handler_mock.call_count, 0)

    def test_announce_handler_not_called__missing_left(self, handler_mock):
        del self.announce_data['left']
        request = self.announce_request()
        self.announce_view(request, announce_key=self.user.announce_key_id)
        self.assertEqual(handler_mock.call_count, 0)

    def test_compact_peer_representation(self, handler_mock):
        request = self.announce_request()
        response = self.announce_view(request, announce_key=self.user.announce_key_id)
        response = bdecode(response.content)
        compact_peers = response['peers']

        # Six bytes for each peer's compact representation
        self.assertEqual(len(compact_peers), self.swarm.peers.count() * 6)

        # Make sure each one is present
        for peer in self.swarm.peers.all():
            self.assertIn(
                a2b_base64(peer.compact_representation),
                compact_peers,
            )
