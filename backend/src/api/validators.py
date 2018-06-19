# -*- coding: utf-8 -*-

from rest_framework.exceptions import PermissionDenied

from invites.models import Invite
from www.models import Feature


def invite_key_validator(invite_key):
    """
    Make sure either the key is valid, or open registration is active.
    """

    if invite_key:
        if not Invite.objects.is_valid(invite_key):
            raise PermissionDenied("invite_key is invalid or expired")

    else:
        if not Feature.objects.is_enabled('open_registration'):
            raise PermissionDenied("open registration is not active")

    return invite_key
