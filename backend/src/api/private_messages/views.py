from rest_framework import viewsets
from rest_framework import mixins, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action

from api.mixins import MultiSerializerViewSetMixin
from private_messages import models
from . import serializers


class ConversationViewSet(MultiSerializerViewSetMixin, viewsets.GenericViewSet,
                          mixins.ListModelMixin, mixins.RetrieveModelMixin):
    """
    For all conversations. Please note the pagination on the messages for a pm
    """
    permission_classes = [permissions.IsAuthenticated]

    serializer_class = serializers.ConversationSerializer
    serializer_action_classes = {
        'list': serializers.ConversationSerializer,
        'create': serializers.InitialMessageSerializer,
        'retrieve': serializers.ConversationDetailSerializer,
        'reply': serializers.ReplySerializer
    }

    def get_queryset(self, *args, **kwargs):
        return models.Conversation.objects.for_user(self.request.user)

    # Custom create model - for different (hacky) behaviour
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        # hack alert - https://github.com/encode/django-rest-framework/issues/1563
        # we want to return the detail serializer back from the api not the request
        conversation = models.Conversation.objects.get(id=serializer.data['pk'])
        conv_serializer = serializers.ConversationDetailSerializer(
            conversation,
            context={'request': self.request}
        )
        return Response(conv_serializer.data, status=status.HTTP_201_CREATED)

    @action(methods=['post'], detail=True)
    def reply(self, request, pk=None):
        """
        Add a new message to the chain
        """
        conversation = self.get_object()
        serializer = serializers.ReplySerializer(data=request.data, context={
            'request': request,
            'conversation': conversation
        })
        serializer.is_valid(raise_exception=True)
        serializer.save()
        conv_serializer = serializers.ConversationDetailSerializer(
            conversation,
            context={'request': self.request}
        )
        return Response(conv_serializer.data, status=status.HTTP_201_CREATED)

    @action(methods=['post'], detail=True)
    def mark_read(self, request, pk=None):
        """
        Mark a thread as read
        """
        conversation = self.get_object()
        conversation.clear_notification(request.user)
        conv_serializer = serializers.ConversationDetailSerializer(
            conversation,
            context={'request': self.request}
        )
        return Response(conv_serializer.data, status=status.HTTP_201_CREATED)
