# -*- coding: utf-8 -*-


from rest_framework import serializers
from rest_framework_recursive.fields import RecursiveField

from private_messages.models import Message
from users.models import User

from ..mixins import AllowFieldLimitingMixin
from ..users.serializers import DisplayUserSerializer


class ReplyMessageSerializer(AllowFieldLimitingMixin, serializers.ModelSerializer):
    sender = DisplayUserSerializer(read_only=True)
    recipient = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    children = serializers.ListField(read_only=True, child=RecursiveField(), source='children.all')
    sent_at = serializers.DateTimeField(read_only=True)
    replied_at = serializers.DateTimeField(read_only=True)
    parent = serializers.PrimaryKeyRelatedField(queryset=Message.objects.all(), required=True)

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
            'sent_at',
            'replied_at',
            'children',
        )

    def create(self, validated_data):
        validated_data['sender'] = self.context['request'].user
        return super().create(validated_data)


class MessageSerializer(AllowFieldLimitingMixin, serializers.ModelSerializer):
    sender = DisplayUserSerializer(read_only=True)
    recipient = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    subject = serializers.CharField(allow_blank=False)
    children = serializers.ListField(read_only=True, child=RecursiveField(), source='children.all')
    sent_at = serializers.DateTimeField(read_only=True)
    replied_at = serializers.DateTimeField(read_only=True)

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
            'replied_at',
        )

    def create(self, validated_data):
        validated_data['sender'] = self.context['request'].user
        return super().create(validated_data)
