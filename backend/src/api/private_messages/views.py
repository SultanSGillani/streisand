from django_filters import rest_framework as filters
from rest_framework.mixins import CreateModelMixin, ListModelMixin, RetrieveModelMixin, UpdateModelMixin
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.viewsets import GenericViewSet, ModelViewSet
from rest_framework_extensions.mixins import NestedViewSetMixin

from private_messages.models import Message

from .filters import MessageFilter, MessageReplyFilter
from .serializers import MessageSerializer, ReplyMessageSerializer, SenderTrashSerializer, RecipientTrashSerializer


class AdminMessageViewSet(ModelViewSet):
    """
    Viewset for Staff to view messages for all (Not sure if we keep this)
    """
    serializer_class = MessageSerializer
    permission_classes = [IsAdminUser]
    filter_backends = [filters.DjangoFilterBackend]
    filter_class = MessageFilter

    queryset = Message.objects.all().select_related('parent').order_by('-sent_at')


class MessageViewSet(NestedViewSetMixin, CreateModelMixin, ListModelMixin, RetrieveModelMixin, GenericViewSet):
    """
    Viewset PM's between users. There is no option for Put/Patch/Delete requests here once a message is created.
    This will show all messages where the parent message is null (Initial Message).

    See the Reply Message ViewSet for creating replies to messages.
    """
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.DjangoFilterBackend]
    filter_class = MessageFilter

    queryset = Message.objects.all().select_related('parent').filter(parent__isnull=True).order_by('level')


class ReplyMessageViewSet(ModelViewSet):
    """
    Viewset for Message Replies. Parent field is required.

    Parent = parent message id. You must enter the parent thread you are replying to for this to work correctly.
    The user will receive no results here if they do not have a parent message.

    The URL is for example /api/v1/message/{parent_id}/reply
    """
    serializer_class = ReplyMessageSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.DjangoFilterBackend]
    filter_class = MessageReplyFilter

    queryset = Message.objects.all().select_related(
        'parent',
        'sender',
        'recipient'
    ).filter(parent__isnull=False).order_by('-sent_at', 'level')


class InboxViewSet(ListModelMixin, RetrieveModelMixin, UpdateModelMixin, GenericViewSet):
    """
    Inbox view for messages. This shows all messages for the user if they are set as the recipient of a message.

    A message will not show here if the message is set as deleted_inbox=True.
    Once that happens, a message is set for deletion, and the message is in the InboxTrashViewSet.

    Go to /api/v1/inbox/{pk} and make a PUT/Patch request on deleted_inbox field from False to True to
    make the message moved to the inbox-trash viewset.

    """
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.DjangoFilterBackend]
    filter_class = MessageFilter

    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return RecipientTrashSerializer
        return MessageSerializer

    # We change serializer class here on PUT requests because we do not want the is_deleted field to be required
    # for the initial serializer this viewset uses (MessageSerializer) since it is the first endpoint needed for
    # initial messages. The deleted_inbox field is never Null,
    # so we only request this to PUT and send to the Trash Inbox

    def get_queryset(self):
        queryset = Message.objects.all().filter(
            recipient=self.request.user,
            recipient_deleted_at__isnull=True
        ).order_by('-sent_at')

        return queryset


class InboxTrashViewSet(ListModelMixin, RetrieveModelMixin, GenericViewSet):
    """
    ViewSet for Inbox Messages sent to the trash.

    Recipient Inbox field of deleted_inbox=True. Once this happens, the field recipient_deleted_at
    is timestamped, and the message appears here.
    """
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


class OutBoxViewSet(ListModelMixin, RetrieveModelMixin, UpdateModelMixin, GenericViewSet):
    """
    Outbox view for messages. This shows all messages for the user if they are set as the sender of a message.
    A message will not show here if the message is set as deleted_outbox=True.
    Once that happens, a message is set for deletion, and the message is in the OutboxTrashViewSet.

    Go to /api/v1/outbox/{pk} and make a PUT/Patch request on deleted_outbox field from False to True to
    make the message moved to the outbox-trash viewset.

    """
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.DjangoFilterBackend]
    filter_class = MessageFilter

    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return SenderTrashSerializer
        return MessageSerializer

    def get_queryset(self):
        queryset = Message.objects.all().filter(
            sender=self.request.user,
            sender_deleted_at__isnull=True,
        ).order_by('-sent_at')

        return queryset


class OutBoxTrashViewSet(ListModelMixin, RetrieveModelMixin, GenericViewSet):
    """
    ViewSet for Outbox Messages sent to the trash.

    Recipient Outbox field of deleted_outbox=True. Once this happens, the field sender_deleted_at
    is timestamped, and the message appears here.
    """
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.DjangoFilterBackend]
    filter_class = MessageFilter

    def get_queryset(self):
        queryset = Message.objects.all().filter(
            sender=self.request.user,
            sender_deleted_at__isnull=False,
        ).order_by('-sent_at')

        return queryset
