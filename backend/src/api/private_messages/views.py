from rest_framework import mixins, permissions
from rest_framework import viewsets

from private_messages.models import Message

from . import serializers


class MessageViewSet(mixins.CreateModelMixin,
                     mixins.ListModelMixin,
                     mixins.RetrieveModelMixin,
                     mixins.DestroyModelMixin,
                     viewsets.GenericViewSet):

    serializer_class = serializers.MessageSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Message.objects.all().select_related(
        'reply_to'
    ).filter(
        reply_to__isnull=True
    ).order_by(
        'level'
    )


class InboxViewSet(mixins.ListModelMixin,
                   mixins.RetrieveModelMixin,
                   viewsets.GenericViewSet):

    serializer_class = serializers.MessageSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Message.objects.all(
    ).select_related(
        'reply_to',
        'sender',
        'recipient'
    ).prefetch_related(
        'reply_to',
    ).order_by(
        '-created_at',
        'level'
    ).distinct()


class ReplyMessageViewSet(mixins.CreateModelMixin,
                          mixins.ListModelMixin,
                          mixins.RetrieveModelMixin,
                          viewsets.GenericViewSet):

    serializer_class = serializers.ReplyMessageSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Message.objects.all().select_related(
        'reply_to',
        'sender',
        'recipient'
    ).filter(
        reply_to__isnull=False,
    ).order_by(
        '-created_at',
        'subject',
    ).distinct()
