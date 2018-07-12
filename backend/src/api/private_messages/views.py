from rest_framework import mixins, permissions
from rest_framework import viewsets
from rest_framework_extensions.mixins import NestedViewSetMixin


from private_messages.models import Message

from . import serializers


class MessageViewSet(NestedViewSetMixin, mixins.CreateModelMixin, mixins.ListModelMixin,
                     mixins.RetrieveModelMixin, mixins.DestroyModelMixin,
                     viewsets.GenericViewSet):

    serializer_class = serializers.MessageSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Message.objects.all().select_related('parent').filter(
        parent__isnull=True).order_by('level')


class InboxViewSet(mixins.ListModelMixin, mixins.RetrieveModelMixin,
                   viewsets.GenericViewSet):

    serializer_class = serializers.MessageSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Message.objects.all().select_related(
        'parent', 'sender',
        'recipient').prefetch_related('parent').order_by(
            '-created_at', 'level').distinct()

    def get_queryset(self):
        queryset = Message.objects.all().filter(recipient=self.request.user)

        return queryset


class OutBoxViewSet(mixins.ListModelMixin, mixins.RetrieveModelMixin,
                    viewsets.GenericViewSet):

    serializer_class = serializers.MessageSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Message.objects.all().select_related(
        'parent', 'sender', 'recipient').prefetch_related(
            'parent',).order_by('-sent_at', 'level').distinct()

    def get_queryset(self):
        queryset = Message.objects.all().filter(sender=self.request.user)
        return queryset


class ReplyMessageViewSet(viewsets.ModelViewSet):

    serializer_class = serializers.ReplyMessageSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Message.objects.all().select_related(
        'parent', 'sender', 'recipient').filter(
            parent__isnull=False,).order_by('-sent_at',
                                              'subject').distinct()

