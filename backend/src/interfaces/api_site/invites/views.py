from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from .serializers import InviteSerializer

from invites.models import Invite


class InviteViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = InviteSerializer
    queryset = Invite.objects.all(

    ).prefetch_related(
        'offered_by',
    ).order_by(
        'created_at'
    )

    def perform_create(self, serializer):
        serializer.validated_data['offered_by'] = self.request.user
        return super(InviteViewSet, self).perform_create(serializer)
