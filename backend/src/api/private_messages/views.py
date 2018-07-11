# -*- coding: utf-8 -*-

from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.status import HTTP_201_CREATED

from rest_framework.mixins import CreateModelMixin, ListModelMixin, DestroyModelMixin, RetrieveModelMixin
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import GenericViewSet, ModelViewSet

from private_messages.models import Message

from .serializers import MessageSerializer, ReplyMessageSerializer
from .filters import MessageFilter


class MessageViewSet(ModelViewSet):
    lookup_field = 'pk'
    serializer_class = MessageSerializer
    queryset = Message.objects.all().select_related(
        'parent',
    ).filter(
        parent__isnull=True
    )
    permission_classes = [IsAuthenticated]
    filter_class = MessageFilter
    filter_backends = [DjangoFilterBackend]

    @action(methods=['get'], detail=False)
    def messages(self, request, pk=None):
        message = self.get_object()

        qs = message.objects.all().order_by('-sent_at')

        page = self.paginate_queryset(qs)
        if page is not None:
            serializer = MessageSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = MessageSerializer(qs, many=True)
        return Response(serializer.data)

    @action(methods=['post'], detail=True)
    def reply(self, request, pk=None):
        message = self.get_object()

        serializer = ReplyMessageSerializer(data=request.data)
        if serializer.is_valid():
            message = Message.objects.create(**request.data)

        return Response({'id': message.id})

        # return Message.objects.all().select_related(
        #     'parent',
        #     'sender',
        #     'recipient'
        # ).filter(
        #     recipient=self.request.user,
        #     parent__is_null=False,
        # ).order_by(
        #     '-sent_at',
        #     'level'
        # )


class InboxViewSet(ListModelMixin, RetrieveModelMixin, GenericViewSet):
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]
    filter_class = MessageFilter
    filter_backends = [DjangoFilterBackend]

    def get_queryset(self):
        return Message.objects.all().select_related(
            'parent',
            'sender',
            'recipient'
        ).filter(
            recipient=self.request.user
        ).order_by(
            '-sent_at',
            'level'
        )


class OutBoxViewSet(ListModelMixin, RetrieveModelMixin, DestroyModelMixin, GenericViewSet):
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]
    filter_class = MessageFilter
    filter_backends = [DjangoFilterBackend]

    def get_queryset(self):
        return Message.objects.all().select_related(
            'parent',
            'sender',
            'recipient'
        ).filter(
            sender=self.request.user
        ).order_by(
            '-sent_at',
            'level'
        )


class ReplyMessageViewSet(CreateModelMixin, ListModelMixin, DestroyModelMixin,
                          RetrieveModelMixin, GenericViewSet):
    """
    ViewSets for Replies only. For this to work correctly you must select a parent message to reply to.
    This viewset will only return
    """

    serializer_class = ReplyMessageSerializer
    permission_classes = [IsAuthenticated]
    filter_class = MessageFilter
    filter_backends = [DjangoFilterBackend]
    queryset = Message.objects.all().select_related(
        'parent',
        'sender',
        'recipient'
    ).filter(
        parent__isnull=False,
    ).order_by(
        '-sent_at',
        'subject'
    )
