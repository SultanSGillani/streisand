# -*- coding: utf-8 -*-

from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver

from www.tasks import async_email


# Signal handler for new invites
@receiver(post_save, sender='invites.Invite')
def handle_new_invite(**kwargs):

    if kwargs['created']:

        invite = kwargs['instance']

        # Send email to invitee
        async_email.delay(
            subject="You have been invited to {site_name}!".format(
                site_name=settings.SITE_NAME,
            ),
            template='email/invite.html',
            context={
                'inviter': invite.offered_by.username,
                'to_email': invite.email,
                'site_name': settings.SITE_NAME,
                'registration_link': invite.registration_link,
            },
            to=[invite.email],
        )
