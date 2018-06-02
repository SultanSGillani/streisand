from django.db import models
from users import models as users_models
from django.core.validators import ValidationError
from django.utils import timezone

from . import managers


class Conversation(models.Model):

    objects = managers.ConversationQuerySet.as_manager()

    sender = models.ForeignKey(users_models.User, related_name='initiated_conversations',
                               on_delete=models.PROTECT)
    receiver = models.ForeignKey(users_models.User, related_name='responded_conversations',
                                 on_delete=models.PROTECT)
    title = models.CharField(max_length=200)  # If you change this change the api serializer too

    sender_notify = models.BooleanField(default=False)
    receiver_notify = models.BooleanField(default=True)

    last_message_sent_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-last_message_sent_at']

    # Can't send message to self
    def clean(self, *args, **kwargs):
        if self.sender == self.receiver:
            raise ValidationError('Sender and receiver cannot be same user')

    # Creators

    @classmethod
    def initiate(cls, sender, receiver, title, body):
        """
        Creates a thread with an initial message
        """

        # I'm assuming atomic requests
        conversation = Conversation(sender=sender, receiver=receiver, title=title)
        conversation.full_clean()
        conversation.save()

        message = Message(conversation=conversation, body=body)
        message.full_clean()
        message.save()
        return conversation

    # Mutators

    def clear_notification(self, user):
        """
        Clear notifications for the user given from this thread
        """
        is_sender = self._is_sender(user)
        if is_sender:
            self.sender_notify = False
        else:
            self.receiver_notify = False
        self.save()

    def reply(self, user, body):
        """
        Send a reply message in this thread from the user
        """
        if self._is_sender(user):
            self.messages.create(body=body, sent_by_initial_sender=True)
            self.sender_notify = False
            self.receiver_notify = True
        else:
            self.messages.create(body=body, sent_by_initial_sender=False)
            self.sender_notify = True
            self.receiver_notify = False
        self.save()

    def update_last_sent(self):
        self.last_message_sent_at = timezone.now
        self.save()

    # Private

    def _is_sender(self, user):
        if self.sender == user:
            return True
        elif self.receiver == user:
            return False
        else:
            raise ValueError('user is not involved in this conversation')


class Message(models.Model):

    conversation = models.ForeignKey(Conversation, related_name='messages',
                                     on_delete=models.CASCADE)
    body = models.TextField()
    sent_at = models.DateTimeField(auto_now_add=True)
    sent_by_initial_sender = models.BooleanField(default=False)

    class Meta:
        ordering = ['sent_at']

    def save(self, *args, **kwargs):
        self.conversation.update_last_sent()
        super(Message, self).save(*args, **kwargs)
