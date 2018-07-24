from django.db import models
from django.utils.timezone import now
from www.mixins import TimeStampedModel
from users.models import User


class Conversation(TimeStampedModel):
    subject = models.CharField(max_length=200)
    creator = models.ForeignKey(User, related_name='created_conversations', on_delete=models.CASCADE)

    def __str__(self):
        return self.subject


class Conversation_Participants(TimeStampedModel):
    subject = models.CharField(max_length=200)
    messages = models.ManyToManyField(Conversation, through='private_messages.Message')
    users = models.ManyToManyField(User)
    read_at = models.DateTimeField(null=True, default=now)
    is_super_user = models.BooleanField(default=False)

    def __str__(self):
        return self.subject


class Message(TimeStampedModel):
    conversation = models.ForeignKey(Conversation, related_name='message_conversation', on_delete=models.CASCADE)
    participant = models.ForeignKey(Conversation_Participants, related_name='user_conversations',
                                    on_delete=models.CASCADE)
    body = models.TextField()

    def __str__(self):
        return self.conversation.subject
