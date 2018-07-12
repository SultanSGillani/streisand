from django_filters import rest_framework as filters
from rest_framework.mixins import CreateModelMixin, ListModelMixin, RetrieveModelMixin, UpdateModelMixin
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.viewsets import GenericViewSet, ModelViewSet
from rest_framework_extensions.mixins import NestedViewSetMixin

from private_messages.models import Message

from .filters import MessageFilter, MessageReplyFilter
from .serializers import MessageSerializer, ReplyMessageSerializer, SenderTrashSerializer, RecipientTrashSerializer


class MessageViewSet(
    NestedViewSetMixin, CreateModelMixin, ListModelMixin, RetrieveModelMixin,
    GenericViewSet
):

    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.DjangoFilterBackend]
    filter_class = MessageFilter

    queryset = Message.objects.all().select_related('parent').filter(
        parent__isnull=True
    ).order_by('level')


class AdminMessageViewSet(ModelViewSet):

    serializer_class = MessageSerializer
    permission_classes = [IsAdminUser]
    filter_backends = [filters.DjangoFilterBackend]
    filter_class = MessageFilter

    queryset = Message.objects.all().select_related('parent'
                                                   ).order_by('-sent_at')


class InboxViewSet(
    ListModelMixin, RetrieveModelMixin, UpdateModelMixin, GenericViewSet
):

    permission_classes = [IsAuthenticated]
    filter_backends = [filters.DjangoFilterBackend]
    filter_class = MessageFilter

    def get_serializer_class(self):
        if self.request.method == 'PUT':
            return RecipientTrashSerializer
        return MessageSerializer

    def get_queryset(self):
        queryset = Message.objects.all().filter(
            recipient=self.request.user,
            recipient_deleted_at__isnull=True,
        ).order_by('-sent_at')

        return queryset


class InboxTrashViewSet(ListModelMixin, RetrieveModelMixin, GenericViewSet):

    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.DjangoFilterBackend]
    filter_class = MessageFilter

    def get_queryset(self):
        queryset = Message.objects.all().filter(
            recipient=self.request.user,
            recipient_deleted_at__isnull=False,
        ).order_by('-sent_at')

        return queryset


class OutBoxViewSet(
    ListModelMixin, RetrieveModelMixin, UpdateModelMixin, GenericViewSet
):

    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.DjangoFilterBackend]
    filter_class = MessageFilter

    def get_serializer_class(self):
        if self.request.method == 'PUT':
            return SenderTrashSerializer
        return MessageSerializer

    def get_queryset(self):
        queryset = Message.objects.all().filter(
            sender=self.request.user,
            sender_deleted_at__isnull=False,
        ).order_by('-sent_at')


class OutBoxTrashViewSet(ListModelMixin, RetrieveModelMixin, GenericViewSet):

    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.DjangoFilterBackend]
    filter_class = MessageFilter

    def get_queryset(self):
        queryset = Message.objects.all().filter(
            recipient=self.request.user,
            recipient_deleted_at__isnull=False,
        ).order_by('-sent_at')

        return queryset


class ReplyMessageViewSet(ModelViewSet):

    serializer_class = ReplyMessageSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.DjangoFilterBackend]
    filter_class = MessageReplyFilter

    queryset = Message.objects.all().select_related(
        'parent', 'sender', 'recipient'
    ).filter(
        parent__isnull=False,
    ).order_by('-sent_at', 'level')
