# -*- coding: utf-8 -*-

from uuid import uuid4

from django.conf import settings
from django.db import models
from django.urls import reverse

from www.tasks import async_email
from www.utils import get_full_url

from .managers import InviteManager


class Invite(models.Model):

    offered_by = models.ForeignKey(
        to='users.User',
        related_name='invites',
        on_delete=models.CASCADE,
    )
    email = models.EmailField(max_length=254, unique=True)
    key = models.UUIDField(default=uuid4, primary_key=True, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)

    objects = InviteManager()

    def __str__(self):
        return '{invite_key}'.format(invite_key=self.key)

    def get_absolute_url(self):
        return reverse('invite_registration', kwargs={'invite_key': self.key})

    def send_email(self):
        async_email.delay(
            subject="You have been invited to {site_name}!".format(
                site_name=settings.SITE_NAME,
            ),
            template='email/invite.html',
            context={
                'inviter': self.offered_by,
                'to_email': self.email,
                'site_name': settings.SITE_NAME,
                'registration_link': get_full_url(self.get_absolute_url()),
            },
            to=[self.email],
        )
