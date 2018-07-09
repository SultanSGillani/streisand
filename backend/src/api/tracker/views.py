# -*- coding: utf-8 -*-

from django_filters import rest_framework as filters
from rest_framework.viewsets import ModelViewSet, ReadOnlyModelViewSet
from rest_framework.permissions import IsAdminUser, IsAuthenticated

from tracker.models import Peer, TorrentClient

from .serializers import TorrentClientSerializer, PeerSerializer, AdminPeerSerializer


class TorrentClientViewSet(ModelViewSet):
    """
    Torrent Clients
    """

    serializer_class = TorrentClientSerializer
    permission_classes = [IsAdminUser]
    queryset = TorrentClient.objects.all().order_by('is_whitelisted', 'peer_id_prefix')


class PeerViewSet(ReadOnlyModelViewSet):
    """
    Peers in a torrent's swarm
    """

    permission_classes = [IsAuthenticated]
    filter_backends = [filters.DjangoFilterBackend]
    filter_fields = ['torrent_id']
    queryset = Peer.objects.select_related('user', 'torrent').order_by('complete', '-first_announce')

    def get_serializer_class(self):
        if self.request.user.is_staff:
            return AdminPeerSerializer
        else:
            return PeerSerializer
