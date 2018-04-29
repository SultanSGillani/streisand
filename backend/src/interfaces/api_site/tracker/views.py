from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAdminUser
from .serializers import TorrentClientSerializer, SwarmSerializer, PeerSerializer
from tracker.models import Peer, Swarm, TorrentClient


class TorrentClientViewSet(ModelViewSet):
    """
    TorrentClient View 1
    """

    serializer_class = TorrentClientSerializer
    permission_classes = [IsAdminUser]
    queryset = TorrentClient.objects.all()


class SwarmViewSet(ModelViewSet):
    """
    Swarm View 1
    """

    serializer_class = SwarmSerializer
    permission_classes = [IsAdminUser]
    queryset = Swarm.objects.all()


class PeerViewSet(ModelViewSet):
    """
    Peer View 1
    """

    serializer_class = PeerSerializer
    permission_classes = [IsAdminUser]
    queryset = Peer.objects.all()
