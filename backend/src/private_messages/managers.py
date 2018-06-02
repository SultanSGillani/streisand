from django.db import models


class ConversationQuerySet(models.QuerySet):

    def for_user(self, user):
        return self.filter(models.Q(sender=user) | models.Q(receiver=user))
