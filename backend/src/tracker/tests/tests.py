# -*- coding: utf-8 -*-

from binascii import a2b_hex
from unittest.mock import patch, ANY
from urllib.parse import urlencode

from django_dynamic_fixture import G

from django.test import TestCase, RequestFactory

from users.models import User

from tracker.models import Swarm, TorrentClient
from tracker.views import AnnounceView
from tracker.utils import unquote_to_hex


@patch('tracker.views.handle_announce.delay')
class AnnounceHandlerTests(TestCase):

    def setUp(self):
        self.factory = RequestFactory()
        self.announce_view = AnnounceView.as_view()
        self.swarm = G(Swarm, torrent_info_hash='894985f97cc25c246e37a07cd7c785993982a7cb')
        self.user = G(User)
        self.client = G(TorrentClient, peer_id_prefix='-DE1360-', is_whitelisted=True)
        self.announce_data = {
            'info_hash': a2b_hex(self.swarm.torrent_info_hash),
            'peer_id': '-DE1360-m8vgv0uzHUF0',
            'uploaded': '422',
            'downloaded': '381',
            'left': '0',
            'port': '1337',
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

    def test_announce_handler_called__proper_announce(self, handler_mock):
        request = self.announce_request()
        self.announce_view(request, announce_key=self.user.announce_key_id)
        self.assertTrue(handler_mock.called)

    def test_announce_handler_called_with_correct_arguments(self, handler_mock):
        request = self.announce_request()
        self.announce_view(request, announce_key=self.user.announce_key_id)
        handler_mock.assert_called_once_with(
            announce_key=self.user.announce_key_id,
            torrent_info_hash=self.swarm.torrent_info_hash,
            new_bytes_uploaded=422,
            new_bytes_downloaded=381,
            bytes_remaining=0,
            event='',
            ip_address='127.0.0.1',
            port=1337,
            peer_id=unquote_to_hex('-DE1360-m8vgv0uzHUF0'),
            user_agent='foobar',
            time_stamp=ANY,
        )

    def test_announce_handler_not_called__bad_announce_key(self, handler_mock):
        request = self.announce_request()
        self.announce_view(request, announce_key='ffffffff-ffff-ffff-ffff-ffffffffffff')
        self.assertFalse(handler_mock.called)

    def test_announce_handler_not_called__bad_info_hash(self, handler_mock):
        self.announce_data.update({'info_hash': 'ffffffffffffffffffff'})
        request = self.announce_request()
        self.announce_view(request, announce_key=self.user.announce_key_id)
        self.assertFalse(handler_mock.called)

    def test_announce_handler_not_called__non_compact(self, handler_mock):
        self.announce_data.update({'compact': '0'})
        request = self.announce_request()
        self.announce_view(request, announce_key=self.user.announce_key_id)
        self.assertFalse(handler_mock.called)

    def test_announce_handler_not_called__non_whitelisted_peer_id(self, handler_mock):
        self.announce_data.update({'peer_id': '-FFFFFF-FFFFFFFFFFFF'})
        request = self.announce_request()
        self.announce_view(request, announce_key=self.user.announce_key_id)
        self.assertFalse(handler_mock.called)

    def test_announce_handler_not_called__missing_info_hash(self, handler_mock):
        del self.announce_data['info_hash']
        request = self.announce_request()
        self.announce_view(request, announce_key=self.user.announce_key_id)
        self.assertFalse(handler_mock.called)

    def test_announce_handler_not_called__missing_peer_id(self, handler_mock):
        del self.announce_data['peer_id']
        request = self.announce_request()
        self.announce_view(request, announce_key=self.user.announce_key_id)
        self.assertFalse(handler_mock.called)

    def test_announce_handler_not_called__missing_port(self, handler_mock):
        del self.announce_data['port']
        request = self.announce_request()
        self.announce_view(request, announce_key=self.user.announce_key_id)
        self.assertFalse(handler_mock.called)

    def test_announce_handler_not_called__missing_uploaded(self, handler_mock):
        del self.announce_data['uploaded']
        request = self.announce_request()
        self.announce_view(request, announce_key=self.user.announce_key_id)
        self.assertFalse(handler_mock.called)

    def test_announce_handler_not_called__missing_downloaded(self, handler_mock):
        del self.announce_data['downloaded']
        request = self.announce_request()
        self.announce_view(request, announce_key=self.user.announce_key_id)
        self.assertFalse(handler_mock.called)

    def test_announce_handler_not_called__missing_left(self, handler_mock):
        del self.announce_data['left']
        request = self.announce_request()
        self.announce_view(request, announce_key=self.user.announce_key_id)
        self.assertFalse(handler_mock.called)
