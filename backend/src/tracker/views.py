# -*- coding: utf-8 -*-

from django.conf import settings
from django.http import HttpResponse
from django.utils.timezone import now
from django.views.generic import View

from users.models import User
from torrents.models import TorrentFile
from www.tasks import handle_announce

from .bencoding import bencode
from .models import Peer, TorrentClient
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

        # Fail if any required parameters are missing
        if not self.REQUIRED_PARAMS.issubset(request.GET):
            return self.failure('Announce request was missing one or more required parameters')

        # Default to a compact response, and possibly fail if the client requests otherwise
        if request.GET.get('compact') == '0':
            compact_peers = False
            if settings.COMPACT_PEERS_ONLY:
                return self.failure('Tracker only sends compact responses')
        else:
            compact_peers = True

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
            peer_id = params['peer_id']

        # Fail if the client is not in the whitelist
        whitelisted_prefixes = TorrentClient.objects.get_whitelist()
        if not peer_id.startswith(whitelisted_prefixes):
            return self.failure('Your client is not in the whitelist')

        #
        # Get announce data
        #

        # The current time
        time_stamp = now()

        # The client's IP address
        ip_address = request.META['REMOTE_ADDR']
        # In debug mode, allow it to be specified as a query param
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
        #    no_peer_id - We default to compact responses.  When
        #        we do send peer dictionaries, we send the peer id.
        #
        #    ip - No proxy announcing allowed; we will distribute
        #        the IP address from which this request originated
        #
        #    trackerid - Most clients don't implement this, and we
        #        have no use for it
        #
        #    key - This doesn't give us anything we don't already
        #        get from the announce_key

        if event and event not in ('started', 'stopped', 'completed'):
            return self.failure('Invalid event name "{event}"'.format(event=event))

        #
        # This is where we start making database queries.
        #

        # Fail if the announce_key is invalid
        try:
            request.user = User.objects.get(announce_key_id=announce_key)
            user_id = request.user.id
        except User.DoesNotExist:
            return self.failure('Invalid announce key')

        # Fail if the torrent is not registered
        try:
            torrent = TorrentFile.objects.get(info_hash=info_hash)
        except TorrentFile.DoesNotExist:
            return self.failure('Unregistered torrent')

        #
        # Update the peer's stats
        #

        suspicious_behaviors = []

        # If there are old peer records for this same ip/port, this announce takes precedence
        torrent.peers.filter(
            ip_address=ip_address,
            port=port,
        ).exclude(
            peer_id=peer_id,
            announce_key=announce_key,
        ).delete()

        client = torrent.peers.filter(ip_address=ip_address, port=port).first()

        if not client:

            if event != 'started':
                suspicious_behaviors.append("No 'started' event for this peer.")

            if event != 'started':
                suspicious_behaviors.append("No 'started' event for this peer.")

            # Add this client to the peer list
            client = torrent.peers.create(
                user_id=user_id,
                announce_key_id=announce_key,
                ip_address=ip_address,
                port=port,
                peer_id=peer_id,
                user_agent=user_agent,
                bytes_remaining=bytes_left,
            )

        if event == 'started':
            if total_bytes_downloaded > 0 or total_bytes_uploaded > 0:
                suspicious_behaviors.append("Upload or download reported as part of a 'started' event.")
            client.bytes_uploaded = 0
            client.bytes_downloaded = 0

        bytes_recently_downloaded = total_bytes_downloaded - client.bytes_downloaded
        if bytes_recently_downloaded > 0:
            client.bytes_downloaded = total_bytes_downloaded
        elif bytes_recently_downloaded < 0:
            suspicious_behaviors.append("Downloaded bytes delta is negative.")

        bytes_recently_uploaded = total_bytes_uploaded - client.bytes_uploaded
        if bytes_recently_uploaded > 0:
            client.bytes_uploaded = total_bytes_uploaded
        elif bytes_recently_uploaded < 0:
            suspicious_behaviors.append("Uploaded bytes delta is negative.")

        client.bytes_remaining = bytes_left
        client.complete = bytes_left == 0
        if event == 'completed' and bytes_left != 0:
            suspicious_behaviors.append("Bytes left is non-zero for 'completed' event.")

        #
        # Queue a task to handle record keeping for the site
        #

        handle_announce.delay(
            user_id=user_id,
            announce_key=announce_key,
            torrent_info_hash=info_hash,
            new_bytes_uploaded=bytes_recently_uploaded,
            new_bytes_downloaded=bytes_recently_downloaded,
            total_bytes_uploaded=total_bytes_uploaded,
            total_bytes_downloaded=total_bytes_downloaded,
            bytes_remaining=bytes_left,
            event=event,
            ip_address=ip_address,
            port=port,
            peer_id=peer_id,
            user_agent=user_agent,
            time_stamp=time_stamp,
            suspicious_behaviors=suspicious_behaviors or None,
        )

        #
        # Prepare the response for the client
        #

        if event == 'stopped':

            client.delete()

            # No need to get a list or count of peers
            active_peers = Peer.objects.none()
            active_seeder_count = 0
            active_leecher_count = 0

        else:

            client.save()

            # If we're responding to a seeder, only send them leechers
            active_peers = torrent.peers.active()
            if client.complete:
                active_peers = active_peers.leechers()

            active_seeder_count = torrent.peers.active().seeders().count()
            active_leecher_count = torrent.peers.active().leechers().count()

        if compact_peers:
            peer_list = active_peers.compact(limit=num_want)
        else:
            peer_list = active_peers.dictionary(limit=num_want)

        return BencodedResponse({
            'interval': self.ANNOUNCE_INTERVAL_IN_SECONDS,
            'min interval': self.ANNOUNCE_INTERVAL_IN_SECONDS,
            'complete': active_seeder_count,
            'incomplete': active_leecher_count,
            'peers': peer_list,
        })

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
