# -*- coding: utf-8 -*-

from django.contrib.auth import SESSION_KEY, get_user
from django.contrib.auth.models import AnonymousUser
from django.core.cache import cache
from django.utils.functional import SimpleLazyObject

from users.models import User, UserIPAddress


class ExtraExceptionInfoMiddleware:
    """
    This middleware adds relevant information to the request when there is an exception
    """

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        return self.get_response(request)

    @staticmethod
    def process_exception(request, exception):
        if request.user.is_authenticated:
            request.META['USER'] = request.user.username


class XForwardedForMiddleware:

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):

        try:
            real_ip = request.META['HTTP_X_FORWARDED_FOR']
        except KeyError:
            pass
        else:
            # HTTP_X_FORWARDED_FOR can be a comma-separated list of IPs.
            # Take just the first one.
            request.META['REMOTE_ADDR'] = real_ip.split(',')[0]

        return self.get_response(request)


class IPHistoryMiddleware:

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):

        if request.user.is_authenticated:
            # Update the user's IP history
            UserIPAddress.objects.update_or_create(
                user=request.user,
                ip_address=request.META['REMOTE_ADDR'],
                used_with='site',
            )

        return self.get_response(request)


class CachedUserAuthenticationMiddleware:
    """
    Middleware that caches request.user for a session so it doesn't have to be
    looked up in the database for every page load.

    Inspired by: https://github.com/ui/django-cached_authentication_middleware
    """

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        request.user = SimpleLazyObject(
            lambda: self.get_cached_user_from_request(request)
        )
        return self.get_response(request)

    @staticmethod
    def get_cached_user_from_request(request):

        if not hasattr(request, '_cached_user'):

            try:

                key = User.CACHE_KEY.format(
                    user_id=request.session[SESSION_KEY]
                )

            except KeyError:

                request._cached_user = AnonymousUser()

            else:

                # Try to get the cached user object
                user = cache.get(key)

                # On a cache miss, get the user and cache it
                if user is None:

                    user = get_user(request)

                    if user.is_authenticated:
                        # Cache the permissions too
                        user.user_class
                        user.get_all_permissions()
                        cache.set(key, user)

                request._cached_user = user

        return request._cached_user

    @staticmethod
    def clear_all_cached_users():
        for user_id in User.objects.values_list('id', flat=True).iterator():
            key = User.CACHE_KEY.format(user_id=user_id)
            cache.delete(key)
