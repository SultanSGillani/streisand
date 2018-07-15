# -*- coding: utf-8 -*-
from rest_framework import serializers
from rest_framework_recursive.fields import RecursiveField

from private_messages.models import Message
from users.models import User

from ..mixins import AllowFieldLimitingMixin
from ..users.serializers import DisplayUserSerializer


class ReplyMessageSerializer(AllowFieldLimitingMixin, serializers.ModelSerializer):
    """
    Reply to the initial Message. We are selecting the parent message, and then
    adding child messages to the initial message.

    /api/v1/messages/{parent_id}/reply/

    """
    sender = DisplayUserSerializer(read_only=True)
    recipient = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    children = serializers.ListField(read_only=True, child=RecursiveField(), source='children.all')

    class Meta:
        model = Message
        fields = (
            'id',
            'parent',
            'level',
            'sender',
            'recipient',
            'body',
            'sender_deleted_at',
            'recipient_deleted_at',
            'replied_at',
            'children',
        )

    def create(self, validated_data):
        validated_data['sender'] = self.context['request'].user
        return super().create(validated_data)


class MessageSerializer(AllowFieldLimitingMixin, serializers.ModelSerializer):
    sender = DisplayUserSerializer(read_only=True)
    recipient = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    deleted_message = serializers.SerializerMethodField()
    subject = serializers.CharField(allow_blank=False)
    children = serializers.ListField(read_only=True, child=RecursiveField(), source='children.all')

    class Meta:
        model = Message
        fields = (
            'id',
            'parent',
            'children',
            'level',
            'sender',
            'recipient',
            'deleted_message',
            'subject',
            'body',
            'sent_at',
        )

    def get_deleted_message(self, obj):
        if obj.sender_deleted_at or obj.recipient_deleted_at is not None:
            return True
        return False

    def create(self, validated_data):
        validated_data['sender'] = self.context['request'].user
        return super().create(validated_data)


class SenderTrashSerializer(serializers.ModelSerializer):
    sender_deleted_date = serializers.DateTimeField(read_only=True, source='sender_deleted_at')

    class Meta:
        model = Message
        fields = (
            'id',
            'parent',
            'deleted_outbox',
            'sender_deleted_date'
        )


class RecipientTrashSerializer(serializers.ModelSerializer):
    recipient_deleted_date = serializers.DateTimeField(read_only=True, source='recipient_deleted_at')

    class Meta:
        model = Message
        fields = (
            'id',
            'parent',
            'deleted_inbox',
            'recipient_deleted_date'
        )
