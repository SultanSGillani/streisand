from django.db import models
from django.utils.timezone import now
from www.mixins import TimeStampedModel


class Conversation(TimeStampedModel):
    title = models.CharField(max_length=200)
    users = models.ManyToManyField(
        to='users.User',
        through='private_messages.Conversation_Participants',
    )
    subject = models.CharField(max_length=200)
    body = models.TextField()

    class Meta:
        ordering = ['title']

    def __str__(self):
        return self.title


class Message(TimeStampedModel):
    title = models.CharField(max_length=200)
    conversation = models.ForeignKey(
        to='private_messages.Conversation',
        related_name='messages',
        on_delete=models.CASCADE, )
    user = models.ForeignKey(
        to='users.User',
        related_name='sent_messages',
        on_delete=models.CASCADE, )

    def __str__(self):
        return self.title


class Conversation_Participants(TimeStampedModel):
    user = models.ForeignKey(
        to='users.User',
        related_name='participants',
        on_delete=models.CASCADE, )
    conversation = models.ForeignKey(
        to='private_messages.Conversation',
        related_name='conversations',
        on_delete=models.CASCADE, )
    read_at = models.DateTimeField(null=True, default=now)
    is_staff = models.BooleanField(default=False)

    def __str__(self):
        return '{subject} ({users})'.format(subject=self.conversation.messages.subject, users=self.user.username)
