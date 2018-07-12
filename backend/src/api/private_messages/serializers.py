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

    # See here https://github.com/encode/django-rest-framework/issues/2555#issuecomment-253201525
    # The reason we are instantiating the DisplayUserSerializer here is because Context
    # does not have access to request initially per the below error.
    # This could be because of MPTT / Parent/child relationships in this model.
    # ('Context does not have access to request')

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['sender'] = DisplayUserSerializer(context=self.context)

    def create(self, validated_data):
        validated_data['sender'] = self.context['request'].user
        return super().create(validated_data)


class MessageSerializer(AllowFieldLimitingMixin, serializers.ModelSerializer):
    sender = DisplayUserSerializer(read_only=True)
    recipient = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
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
            'subject',
            'body',
            'sent_at',
        )

    # See here https://github.com/encode/django-rest-framework/issues/2555#issuecomment-253201525
    # The reason we are instantiating the DisplayUserSerializer here is because Context
    # does not have access to request initially per the below error.
    # ('Context does not have access to request')

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['sender'] = DisplayUserSerializer(context=self.context)

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
