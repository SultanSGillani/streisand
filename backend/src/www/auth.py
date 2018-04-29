# -*- coding: utf-8 -*-

from collections import OrderedDict
from hashlib import md5, sha1

from django.conf import settings
from django.contrib.auth.backends import ModelBackend
from django.contrib.auth.hashers import BasePasswordHasher, mask_hash
from django.contrib.auth.models import Permission
from django.db.models import Q
from django.utils.crypto import constant_time_compare

from users.models import User


class CustomAuthBackend(ModelBackend):

    def get_user(self, user_id):
        try:
            user = User.objects.filter(
                id=user_id
            ).select_related(
                'user_class',
            ).get()
        except User.DoesNotExist:
            user = None
        return user

    def authenticate(self, username=None, password=None, **kwargs):
        """
        Django's built-in ModelBackend assumes usernames are case-sensitive
        during authentication, which can be non-intuitive.  This method supports
        case-insensitive username authentication.
        """

        try:
            user = User.objects.get(username__iexact=username)
            if user.check_password(password):
                return user
            else:
                return None
        except User.DoesNotExist:
            # Run the default password hasher once to reduce the timing
            # difference between an existing and a non-existing user.
            User().set_password(password)

    def has_perm(self, user_obj, perm, obj=None):
        if not user_obj.is_active:
            return False
        return perm in self.get_all_permissions(user_obj, obj)

    def get_all_permissions(self, user, obj=None):
        """
        Returns a set of permission strings the user has from their groups,
        user class, and custom permissions.
        """
        if not user.is_active or user.is_anonymous or obj is not None:
            return set()

        if not hasattr(user, '_perm_cache'):

            permissions = Permission.objects.filter(
                # User permissions
                Q(user=user)
                # Group permissions
                | Q(group__user=user)
                # UserClass permissions
                | Q(user_classes__users=user)
            ).distinct().values_list(
                'content_type__app_label',
                'codename',
            )

            user._perm_cache = set(
                '{app_label}.{codename}'.format(
                    app_label=app_label,
                    codename=codename,
                )
                for app_label, codename
                in permissions
            )

        return user._perm_cache


class OldSitePasswordHasher(BasePasswordHasher):

    algorithm = 'old_hash'

    def encode(self, password, salt):
        """
        Creates an encoded database value

        The result is normally formatted as "algorithm$salt$hash" and
        must be fewer than 128 characters.
        """
        assert password is not None
        assert salt and '$' not in salt
        old_site_secret = settings.OLD_SITE_SECRET_KEY
        salt = salt.encode('utf-8')
        secret_md5 = md5(salt).hexdigest()
        secret_sha1 = sha1(salt).hexdigest()
        things = (secret_md5 + password + secret_sha1 + old_site_secret).encode('utf-8')
        password_hash = sha1(things).hexdigest()
        return '{algorithm}${salt}${hash}'.format(
            algorithm=self.algorithm,
            salt=salt.decode('utf-8'),
            hash=password_hash,
        )

    def verify(self, password, encoded):
        """
        Checks if the given password is correct
        """
        algorithm, salt, password_hash = encoded.split('$', 2)
        assert algorithm == self.algorithm
        hashed_input = self.encode(password, salt)
        return constant_time_compare(hashed_input, encoded)

    def safe_summary(self, encoded):
        """
        Returns a summary of safe values

        The result is a dictionary and will be used where the password field
        must be displayed to construct a safe representation of the password.
        """
        algorithm, salt, password_hash = encoded.split('$', 2)
        assert algorithm == self.algorithm
        return OrderedDict([
            ('algorithm', algorithm),
            ('salt', mask_hash(salt)),
            ('hash', mask_hash(password_hash)),
        ])

    def harden_runtime(self, password, encoded):
        pass
