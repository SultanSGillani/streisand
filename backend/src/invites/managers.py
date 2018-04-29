# -*- coding: utf-8 -*-

from django.db import models
from django.utils.timezone import now, timedelta


class InviteManager(models.Manager):

    INVITES_VALID_FOR = timedelta(hours=72)

    def is_valid(self, invite_key):
        return self.filter(
            key=invite_key,
            created_at__gte=now() - self.INVITES_VALID_FOR,
        ).exists()
