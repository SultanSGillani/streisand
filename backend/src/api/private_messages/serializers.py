from rest_framework import serializers
from rest_framework_recursive.fields import RecursiveField

from private_messages.models import Message
from users.models import User

from ..mixins import AllowFieldLimitingMixin
from ..users.serializers import DisplayUserSerializer


class MessageSerializer(serializers.ModelSerializer, AllowFieldLimitingMixin):
    sender = DisplayUserSerializer(read_only=True)
    recipient = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    subject = serializers.CharField()
    children = serializers.ListField(read_only=True, child=RecursiveField(), source='children.all')

    class Meta:
        model = Message
        fields = (
            'id',
            'reply_to',
            'children',
            'level',
            'sender',
            'recipient',
            'subject',
            'body',
            'is_deleted',
        )

    def create(self, validated_data):
        validated_data['sender'] = self.context['request'].user
        return super().create(validated_data)


class ReplyMessageSerializer(serializers.ModelSerializer, AllowFieldLimitingMixin):
    sender = DisplayUserSerializer(read_only=True)
    recipient = serializers.PrimaryKeyRelatedField(read_only=True)
    children = serializers.ListField(read_only=True, child=RecursiveField(), source='children.all')
    subject = serializers.StringRelatedField(source='reply_to.subject', read_only=True)

    class Meta:
        model = Message
        fields = (
            'id',
            'reply_to',
            'level',
            'sender',
            'recipient',
            'subject',
            'body',
            'is_deleted',
            'last_opened',
            'children',
        )

    def create(self, validated_data):
        validated_data['sender'] = self.context['request'].user
        return super().create(validated_data)
