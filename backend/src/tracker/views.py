# -*- coding: utf-8 -*-

import pprint

from django.conf import settings
from django.http import HttpResponse
from django.utils.timezone import now
from django.views.generic import View
from users.models import User
from www.tasks import handle_announce
from .bencoding import bencode
from .models import Peer, Swarm, TorrentClient
from .utils import unquote_to_hex


class BencodedResponse(HttpResponse):
    """
    An HTTP response class that consumes data to be serialized using bencoding.
    """

    def __init__(self, data, **kwargs):
        kwargs.setdefault('content_type', 'text/plain')
        data = bencode(data)
        super().__init__(content=data, **kwargs)


class AnnounceView(View):

    ANNOUNCE_INTERVAL = settings.TRACKER_ANNOUNCE_INTERVAL
    ANNOUNCE_INTERVAL_IN_SECONDS = int(ANNOUNCE_INTERVAL.total_seconds())

    REQUIRED_PARAMS = {
        'info_hash',
        'peer_id',
        'port',
        'uploaded',
        'downloaded',
        'left',
    }

    def get(self, request, announce_key):

        #
        # Short circuit bad requests
        #

        # Fail if the announce_key is invalid
        if not User.objects.filter(announce_key_id=announce_key).exists():
            return self.failure('Invalid announce key')

        # Fail if any required parameters are missing
        if not self.REQUIRED_PARAMS <= request.GET.keys():
            return self.failure('Announce request was missing one or more required parameters')

        # Fail if the client will not accept a compact response
        if request.GET.get('compact') == '0':
            return self.failure('This tracker only sends compact responses')

        # The `info_hash` and `peer_id` parameters include raw bytes, and
        # Django irreversibly encodes them into strings for request.GET,
        # so we have to parse them out of the QUERY_STRING header.  >.<
        try:
            params = dict(
                [param.split('=') for param in request.META['QUERY_STRING'].split('&')]
            )
        except Exception:
            return self.failure('Tracker could not parse announce request')
        else:
            info_hash = unquote_to_hex(params['info_hash'])
            peer_id = unquote_to_hex(params['peer_id'])

        # Fail if the client is not in the whitelist
        whitelisted_prefixes = TorrentClient.objects.get_whitelist()
        if not peer_id.startswith(whitelisted_prefixes):
            return self.failure('Your client is not in the whitelist')

        # Fail if the torrent is not registered
        try:
            swarm = Swarm.objects.get(torrent_info_hash=info_hash)
        except Swarm.DoesNotExist:
            if info_hash == unquote_to_hex('ffffffffffffffffffff'):
                return self.failure('Unregistered torrent')
            swarm = Swarm.objects.create(torrent_info_hash=info_hash)

        #
        # Get announce data
        #

        # The current time
        time_stamp = now()

        # The client's IP address
        ip_address = request.META['REMOTE_ADDR']
        # In debug mode, allow it to be specified as a GET param
        if settings.DEBUG:
            ip_address = request.GET.get('ip', ip_address)

        # The port number that the client is listening on
        port = int(request.GET['port'])

        # The user agent string
        user_agent = request.META.get('HTTP_USER_AGENT', '')

        # The total number of bytes uploaded since the first 'started' event
        total_bytes_uploaded = int(request.GET['uploaded'])

        # The total number of bytes downloaded since the first 'started' event
        total_bytes_downloaded = int(request.GET['downloaded'])

        # The number of bytes remaining until 100% completion
        bytes_left = int(request.GET['left'])

        # Either 'started', 'completed', or 'stopped' (optional)
        event = request.GET.get('event', '')

        # Number of peers the client would like to receive (optional)
        num_want = int(request.GET.get('numwant', '50'))

        # Parameters we don't care about:
        #
        #    no_peer_id - We always send compact responses
        #
        #    ip - No proxy announcing allowed; we will distribute
        #        the IP address from which this request originated
        #
        #    trackerid - Most clients don't implement this, and we
        #        have no use for it
        #
        #    key - This doesn't give us anything we don't already
        #        get from the announce_key

        #
        # Delete peers after two announce intervals have passed with no announce
        #

        swarm.peers.filter(
            last_announce__lt=time_stamp - (self.ANNOUNCE_INTERVAL * 2)
        ).delete()

        #
        # Update the peer's stats
        #

        try:

            # Fetch the client from the current peer list
            client = swarm.peers.get(
                user_announce_key=announce_key,
                ip_address=ip_address,
                port=port,
                peer_id=peer_id,
            )

        except Peer.DoesNotExist:

            # Add this client to the peer list
            client = swarm.peers.create(
                user_announce_key=announce_key,
                ip_address=ip_address,
                port=port,
                peer_id=peer_id,
                user_agent=user_agent,
                bytes_remaining=bytes_left,
            )

        bytes_recently_downloaded = total_bytes_downloaded - client.bytes_downloaded
        if bytes_recently_downloaded > 0:
            client.bytes_downloaded = total_bytes_downloaded
        elif bytes_recently_downloaded < 0:
            raise Exception('Something strange is happening here...')

        bytes_recently_uploaded = total_bytes_uploaded - client.bytes_uploaded
        if bytes_recently_uploaded > 0:
            client.bytes_uploaded = total_bytes_uploaded
        elif bytes_recently_uploaded < 0:
            raise Exception('Something strange is happening here...')

        if event == 'completed' and bytes_left != 0:
            raise Exception('Something strange is happening here...')
        client.complete = bytes_left == 0

        client.save()

        if event == 'started':
            # TODO: something?
            pass
        elif event == 'stopped':
            # TODO: something?
            pass
        elif event == 'completed':
            # TODO: something?
            pass
        elif event:
            return self.failure('Tracker could not parse announce request')

        #
        # Queue a task to handle record keeping for the site
        #

        handle_announce.delay(
            announce_key=announce_key,
            torrent_info_hash=info_hash,
            new_bytes_uploaded=bytes_recently_uploaded,
            new_bytes_downloaded=bytes_recently_downloaded,
            bytes_remaining=bytes_left,
            event=event,
            ip_address=ip_address,
            port=port,
            peer_id=peer_id,
            user_agent=user_agent,
            time_stamp=time_stamp,
        )

        #
        # Prepare the response for the client
        #

        # Get the peer list to send back
        if event == 'stopped':
            client.delete()
            compact_peer_list_for_client = b''
        else:
            client.save()
            if client.complete:
                # Leave seeders out of the peer list
                compact_peer_list_for_client = swarm.peers.leechers().compact(limit=num_want)
            else:
                compact_peer_list_for_client = swarm.peers.all().compact(limit=num_want)

        # Get the number of seeders and leechers
        complete = swarm.peers.seeders().count()
        incomplete = swarm.peers.leechers().count()

        # Put everything in a dictionary
        response_dict = {
            'interval': self.ANNOUNCE_INTERVAL_IN_SECONDS,
            'min interval': self.ANNOUNCE_INTERVAL_IN_SECONDS,
            'complete': complete,
            'incomplete': incomplete,
            'peers': compact_peer_list_for_client,
        }

        if settings.DEBUG:
            return HttpResponse(
                '<html>'
                '<head><title>Announce</title></head>'
                '<body>'
                'Auth key: {announce_key}<br/>'
                'IP: {ip}<br/>'
                '<br/>Torrent: {torrent}<br/>'
                '<br/>Peers: {peers}<br/>'
                '<br/>Request params: <pre>{params}</pre><br/>'
                '<br/>Response: <pre>{response_dict}</pre><br/>'
                '</body>'
                '</html>'.format(
                    announce_key=announce_key,
                    ip=ip_address,
                    torrent=swarm,
                    peers=swarm.peers.all(),
                    params=pprint.pformat(params),
                    response_dict=pprint.pformat(response_dict),
                )
            )
        else:
            return BencodedResponse(response_dict)

    @staticmethod
    def failure(reason):
        """
        Send a failure response to the client with the given reason.
        """
        return BencodedResponse(
            {
                'failure reason': reason
            }
        )
