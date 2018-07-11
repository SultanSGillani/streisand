from django.db import models


class MessageManager(models.Manager):

    def inbox(self, user):
        return self.filter(
            recipient=user,
            recipient_deleted_at__isnull=True,
        )

    def outbox(self, user):
        return self.filter(
            sender=user,
            sender_deleted_at__isnull=True,
        )

    def trash(self, user):
        return self.filter(
            recipient=user,
            recipient_deleted_at__isnull=False,
        ) | self.filter(
            sender=user,
            sender_deleted_at__isnull=False,
        )
