# -*- coding: utf-8 -*-

from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAdminUser

from tracker.models import Peer, Swarm, TorrentClient

from .serializers import TorrentClientSerializer, SwarmSerializer, PeerSerializer


class TorrentClientViewSet(ModelViewSet):
    """
    Torrent Clients
    """

    serializer_class = TorrentClientSerializer
    permission_classes = [IsAdminUser]
    queryset = TorrentClient.objects.all()


class SwarmViewSet(ModelViewSet):
    """
    Torrent Swarms
    """

    serializer_class = SwarmSerializer
    permission_classes = [IsAdminUser]
    queryset = Swarm.objects.all()


class PeerViewSet(ModelViewSet):
    """
    Torrent Swarm Peers
    """

    serializer_class = PeerSerializer
    permission_classes = [IsAdminUser]
    queryset = Peer.objects.all()
