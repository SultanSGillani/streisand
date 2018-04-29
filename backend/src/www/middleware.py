# -*- coding: utf-8 -*-

from django.http import HttpResponseRedirect
from django.conf import settings
from django.contrib.auth import SESSION_KEY, get_user
from django.contrib.auth.models import AnonymousUser
from django.core.cache import cache
from django.utils.deprecation import MiddlewareMixin
from django.utils.functional import SimpleLazyObject
from django.utils.http import urlquote

from users.models import User, UserIPAddress


class ExtraExceptionInfoMiddleware(MiddlewareMixin):
    """
    This middleware adds relevant information to the request when there is an exception
    """

    @staticmethod
    def process_exception(request, exception):
        if request.user.is_authenticated:
            request.META[b'USER'] = request.user.username


class XForwardedForMiddleware(MiddlewareMixin):

    @staticmethod
    def process_request(request):
        try:
            real_ip = request.META['HTTP_X_FORWARDED_FOR']
        except KeyError:
            pass
        else:
            # HTTP_X_FORWARDED_FOR can be a comma-separated list of IPs.
            # Take just the first one.
            request.META['REMOTE_ADDR'] = real_ip.split(',')[0]


class IPHistoryMiddleware(MiddlewareMixin):

    @staticmethod
    def process_request(request):
        if request.user.is_authenticated:
            # Update the user's IP history
            UserIPAddress.objects.update_or_create(
                user=request.user,
                ip_address=request.META['REMOTE_ADDR'],
                used_with='site',
            )


class LoginRequiredMiddleware(MiddlewareMixin):
    """
    Middleware that requires a user to be authenticated to view any page other
    than LOGIN_URL. Exemptions to this requirement can optionally be specified
    in settings via a list of prefixes in settings.LOGIN_EXEMPT_URL_PREFIXES.

    Inspired by:
    http://onecreativeblog.com/post/59051248/django-login-required-middleware
    """

    LOGIN_EXEMPT_URL_PREFIXES = (
        settings.LOGIN_URL,
    )
    if hasattr(settings, 'LOGIN_EXEMPT_URL_PREFIXES'):
        LOGIN_EXEMPT_URL_PREFIXES += tuple(settings.LOGIN_EXEMPT_URL_PREFIXES)

    def process_request(self, request):
        if not request.user.is_authenticated:
            if not request.path_info.startswith(self.LOGIN_EXEMPT_URL_PREFIXES):
                redirect_path = '{login_url}?next={next_url}'.format(
                    login_url=settings.LOGIN_URL,
                    next_url=urlquote(request.get_full_path()),
                )
                return HttpResponseRedirect(redirect_path)


class CachedUserAuthenticationMiddleware(MiddlewareMixin):
    """
    Middleware that caches request.user for a session so it doesn't have to be
    looked up in the database for every page load.

    Inspired by: https://github.com/ui/django-cached_authentication_middleware
    """

    def process_request(self, request):
        request.user = SimpleLazyObject(
            lambda: self.get_cached_user_from_request(request)
        )

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
