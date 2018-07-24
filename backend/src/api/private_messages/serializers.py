from rest_framework import serializers
from private_messages.models import Conversation, Message, Conversation_Participants


class ParticipantsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Conversation_Participants
        fields = ('id', 'users', 'read_at', 'is_super_user')


class ConversationSerializer(serializers.ModelSerializer):
    creator = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Conversation
        fields = ('id', 'created_at', 'modified_at', 'creator', 'subject')

    def create(self, validated_data):
        validated_data['creator'] = self.context['request'].user
        return super().create(validated_data)


class MessageSerializer(serializers.ModelSerializer):
    conversation = ConversationSerializer()
    participant = ParticipantsSerializer()

    class Meta:
        model = Message
        fields = ('id', 'conversation', 'participant', 'body')

    def create(self, validated_data):
        """
        Create and return a new `Message` instance, given the validated data.
        """
        conversation_data = validated_data.pop('conversation', None)
        participant_data = validated_data.pop('participant', None)
        if conversation_data:
            conversation = Conversation.objects.create(**conversation_data)
            validated_data['conversation'] = conversation
        if participant_data:
            participant = Conversation_Participants.objects.create(**participant_data)
            validated_data['participant'] = participant
        return Message.objects.create(**validated_data)

    def save(self):
        creator = serializers.CurrentUserDefault()
        conversation = self.validated_data['conversation']
        participant = self.validated_data['participant']
        body = self.validated_data['body']
