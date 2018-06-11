from rest_framework import serializers, pagination
from private_messages import models
from users.models import User


# These serializers are for sending messages
class ReplySerializer(serializers.Serializer):

    body = serializers.CharField()

    def create(self, validated_data):
        user = self.context['request'].user
        conversation = self.context['conversation']
        conversation.reply(user, validated_data['body'])
        return validated_data


class InitialMessageSerializer(serializers.Serializer):

    title = serializers.CharField(max_length=200)  # Change this and remember to change the model
    body = serializers.CharField(allow_blank=False)
    to = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())

    # HACK ALERT - https://github.com/encode/django-rest-framework/issues/1563
    pk = serializers.IntegerField(read_only=True, required=False)

    def create(self, validated_data):
        user = self.context['request'].user
        conversation = models.Conversation.initiate(sender=user,
                                                    receiver=validated_data['to'],
                                                    title=validated_data['title'],
                                                    body=validated_data['body'])
        # hack for viewset
        validated_data['pk'] = conversation.pk
        return validated_data


# These serializers are used for viewing only
class MessageSerializer(serializers.ModelSerializer):

    sent_by_current_user = serializers.SerializerMethodField()

    class Meta:
        model = models.Message
        fields = ('body', 'sent_at', 'sent_by_current_user')

    def get_sent_by_current_user(self, obj):
        return self.context['user_is_sender'] == obj.sent_by_initial_sender


class ConversationSerializer(serializers.ModelSerializer):

    other_user_id = serializers.SerializerMethodField()
    unread = serializers.SerializerMethodField()

    class Meta:
        model = models.Conversation
        fields = ('id', 'title', 'other_user_id', 'unread', 'last_message_sent_at')

    def get_other_user_id(self, obj):
        if self._user() == obj.sender:
            return obj.receiver.id
        else:
            return obj.sender.id

    def get_unread(self, obj):
        if self._user() == obj.sender:
            return obj.sender_notify
        else:
            return obj.receiver_notify

    def _user(self):
        return self.context['request'].user


# Custom paginate on relationship - https://stackoverflow.com/a/34441367
class ConversationDetailSerializer(ConversationSerializer):

    messages = serializers.SerializerMethodField('paginated_messages')

    class Meta:
        model = models.Conversation
        fields = ('id', 'title', 'other_user_id', 'unread', 'last_message_sent_at', 'messages')

    def paginated_messages(self, obj):
        messages = models.Message.objects.filter(conversation=obj)
        paginator = pagination.PageNumberPagination()
        page = paginator.paginate_queryset(messages, self.context['request'])
        user_is_sender = self._user() == obj.sender
        serializer = MessageSerializer(page, many=True, context={
            'request': self.context['request'],
            'user_is_sender': user_is_sender
        })
        # wow this is such an ugly hack
        # get_paginated_response wraps in useful stuff but returns a response so we just extract
        # the data
        return paginator.get_paginated_response(serializer.data).data
