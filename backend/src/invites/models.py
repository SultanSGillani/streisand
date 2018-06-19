# -*- coding: utf-8 -*-

from uuid import uuid4

from django.conf import settings
from django.db import models

from users.models import User

from .managers import InviteManager


class Invite(models.Model):

    offered_by = models.ForeignKey(
        to='users.User',
        related_name='invites',
        on_delete=models.CASCADE,
    )
    email = models.EmailField(
        unique=True,
        validators=[User.email_validator],
    )
    key = models.UUIDField(default=uuid4, primary_key=True, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)

    objects = InviteManager()

    def __str__(self):
        return '{invite_key}'.format(invite_key=self.key)

    @property
    def registration_link(self):
        return settings.INVITE_URL_TEMPLATE.format(
            invite_key=self.key,
        )

    @property
    def expires_at(self):
        return self.created_at + settings.INVITE_TTL

    def delete_and_refund(self, *args, **kwargs):

        super().delete(*args, **kwargs)

        if not self.offered_by.has_perm('users.unlimited_invites'):
            # Increment invite count, using F to avoid race conditions
            User.objects.filter(id=self.offered_by.id).update(invite_count=models.F('invite_count') + 1)
