# -*- coding: utf-8 -*-

from django.conf import settings
from django.db import models, transaction, IntegrityError
from django.utils.timezone import now

from users.models import User


class InviteManager(models.Manager):

    def expired(self):
        return self.filter(
            created_at__lt=now() - settings.INVITE_TTL,
        )

    def currently_valid(self):
        return self.filter(
            created_at__gt=now() - settings.INVITE_TTL,
        )

    def is_valid(self, invite_key):
        return self.currently_valid().filter(key=invite_key).exists()

    def create(self, **kwargs):
        """
        Creates an Invite object.  If the creator does not have unlimited invite permissions,
        their invite_count is decremented as part of the creation transaction.
        """

        user = kwargs['offered_by']

        try:

            with transaction.atomic():

                if not user.has_perm('users.unlimited_invites'):
                    # Decrement invite count, using F to avoid race conditions
                    # Note: this will raise IntegrityError if decrementing would push the count below zero
                    User.objects.filter(id=user.id).update(invite_count=models.F('invite_count') - 1)

                # Create invite
                return super().create(**kwargs)

        except IntegrityError:

            raise ZeroInvitesRemaining()


class ZeroInvitesRemaining(Exception):
    pass
