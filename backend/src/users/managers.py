# -*- coding: utf-8 -*-

from django.contrib.auth.models import UserManager as DjangoUserManager


class UserManager(DjangoUserManager):

    @classmethod
    def normalize_email(cls, email_address):
        """
        Remove dots from user identifier, and lowercase.
        """

        if not email_address or '@' not in email_address:
            raise ValueError('Not a valid email address: {value}'.format(value=email_address))

        (user_identifier, domain) = email_address.strip().rsplit('@', 1)
        normalized_user = user_identifier.replace('.', '')

        return (normalized_user + '@' + domain).lower()
