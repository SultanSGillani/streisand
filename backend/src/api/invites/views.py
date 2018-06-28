# -*- coding: utf-8 -*-

from django.shortcuts import get_object_or_404

from rest_framework.generics import RetrieveAPIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle
from rest_framework.viewsets import ModelViewSet

from invites.models import Invite

from .serializers import InviteSerializer


class InviteViewSet(ModelViewSet):

    permission_classes = [IsAuthenticated]
    serializer_class = InviteSerializer
    http_method_names = ['get', 'post', 'delete', 'head', 'options']

    def get_queryset(self):
        if self.request.user.is_staff:
            return Invite.objects.all()
        else:
            return Invite.objects.filter(offered_by=self.request.user)

    def perform_destroy(self, instance):
        instance.delete_and_refund()


class InviteCheckViewSet(RetrieveAPIView):

    permission_classes = [AllowAny]
    serializer_class = InviteSerializer
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = 'vulnerable_to_brute_force'
    http_method_names = ['get', 'head', 'options']

    def retrieve(self, request, *args, **kwargs):
        """
        Only allow retrieval of valid invites by their key.
        """
        invite = get_object_or_404(
            Invite.objects.currently_valid(),
            key=kwargs['pk'],
        )
        serializer = InviteSerializer(invite)
        return Response(serializer.data)
