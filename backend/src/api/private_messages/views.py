from django_filters import rest_framework as filters
from rest_framework.mixins import CreateModelMixin, ListModelMixin, RetrieveModelMixin
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.viewsets import GenericViewSet, ModelViewSet
from rest_framework_extensions.mixins import NestedViewSetMixin

from private_messages.models import Message

from .filters import MessageFilter
from .serializers import MessageSerializer, ReplyMessageSerializer


class MessageViewSet(NestedViewSetMixin, CreateModelMixin, ListModelMixin,
                     RetrieveModelMixin, GenericViewSet):

    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.DjangoFilterBackend]
    filter_class = MessageFilter

    queryset = Message.objects.all().select_related('parent').filter(
        parent__isnull=True).order_by('level')


class AdminMessageViewSet(ModelViewSet):

    serializer_class = MessageSerializer
    permission_classes = [IsAdminUser]
    filter_backends = [filters.DjangoFilterBackend]
    filter_class = MessageFilter
    
    queryset = Message.objects.all().select_related('parent').order_by(
        '-sent_at')


class InboxViewSet(ListModelMixin, RetrieveModelMixin, GenericViewSet):

    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.DjangoFilterBackend]
    filter_class = MessageFilter

    def get_queryset(self):
        queryset = Message.objects.all().filter(recipient=self.request.user)

        return queryset


class TrashBoxViewSet(ListModelMixin, RetrieveModelMixin, GenericViewSet):

    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.DjangoFilterBackend]
    filter_class = MessageFilter

    def get_queryset(self):
        queryset = Message.objects.all().filter(
             recipient=self.request.user,
             recipient_deleted_at__isnull=True,
        ).order_by('-sent_at')

        return queryset


class OutBoxViewSet(ListModelMixin, RetrieveModelMixin, GenericViewSet):

    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.DjangoFilterBackend]
    filter_class = MessageFilter

    def get_queryset(self):
        queryset = Message.objects.all().select_related(
            'parent', 'sender',
            'recipient').filter(sender=self.request.user).order_by(
                '-sent_at', 'level')
        return queryset


class ReplyMessageViewSet(ModelViewSet):

    serializer_class = ReplyMessageSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.DjangoFilterBackend]
    filter_class = MessageFilter
    
    queryset = Message.objects.all().select_related(
        'parent', 'sender', 'recipient').filter(
            parent__isnull=False,).order_by('-sent_at', 'level')
