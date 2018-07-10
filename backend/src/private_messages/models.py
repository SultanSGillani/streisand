from django.core.validators import ValidationError
from django.contrib.postgres.indexes import GinIndex
from django.db import models
from django.utils.timezone import now

from mptt.models import MPTTModel, TreeForeignKey

from users.models import User


class Message(MPTTModel):
    reply_to = TreeForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='children')
    subject = models.CharField(max_length=200, unique=True)
    body = models.TextField()
    sender = models.ForeignKey(User, related_name='sent_messages', on_delete=models.SET_NULL, null=True)
    recipient = models.ForeignKey(User, related_name='received_messages', on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(default=now, editable=False, null=True)
    last_opened = models.DateTimeField(default=now, editable=False, null=True)
    is_superuser = models.BooleanField(default=False)
    is_deleted = models.BooleanField(default=False)

    def __str__(self):
        return self.subject

    class Meta:
        ordering = ['-created_at']
        indexes = [GinIndex(fields=['id', 'reply_to'])]

    class MPTTMeta:
        parent_attr = 'reply_to'
        order_insertion_by = ['subject']

    def clean(self, *args, **kwargs):
        if self.sender == self.recipient:
            raise ValidationError('Sender and recipient cannot be same user')

    def _is_sender(self, user):
        if self.sender == user:
            return True
        elif self.recipient == user:
            return False
        else:
            raise ValueError('user is not involved in this message')
