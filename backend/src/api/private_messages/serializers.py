from rest_framework import serializers
from private_messages.models import Conversation, Message, Conversation_Participants
from users.models import User


class ParticipantsSerializer(serializers.PrimaryKeyRelatedField, serializers.ModelSerializer):
    class Meta:
        model = Conversation_Participants
        fields = ('user', 'is_staff')


class ConversationSerializer(serializers.ModelSerializer):
    users = ParticipantsSerializer(many=True, queryset=User.objects.all())

    class Meta:
        model = Conversation
        fields = ('id', 'users', 'title', 'subject', 'body')

    def create(self, validated_data):
        user_data = validated_data.pop('users')
        conversation = Conversation.objects.create(**validated_data)
        Conversation_Participants.objects.create(conversation=conversation, **user_data)
        return conversation


class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = '__all__'

    # def create(self, validated_data):
    #     """
    #     Create and return a new `Message` instance, given the validated data.
    #     """
    #     conversation_data = validated_data.pop('conversation')
    #     message_author = self.context['request'].user
    #     message = Message.objects.create(**validated_data)
    #     Conversation.objects.create(**conversation_data)
    #     return message
    #
    # def create(self, validated_data):
    #     conversation_data = validated_data.pop('conversation')
    #     participant_data = validated_data.pop('participant')
    #     message = Message.objects.create(**validated_data)
    #     conversation = Conversation.objects.create(message=message, **conversation_data)
    #     participant = Conversation_Participants(message=message, conversation=conversation)
    #     participant.save()
    #     print(participant.participant)
    #     for key in participant_data:
    #         for participant in participant_data[key]:
    #             participant.participants.add(participant)
    #     print(participant.participants)
    #     return message
    #
    # def save(self):
    #     creator = serializers.CurrentUserDefault()
    #     conversation = self.validated_data['conversation']
    #     participant = self.validated_data['participant']
    #     body = self.validated_data['body']
    # return self
