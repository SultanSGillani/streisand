# -*- coding: utf-8 -*-

from rest_framework.throttling import SimpleRateThrottle


class DOSDefenseThrottle(SimpleRateThrottle):
    """
    Limits the rate of POST requests per user.
    """

    scope = 'vulnerable_to_dos_attack'

    def allow_request(self, request, view):

        # We only care about throttling POST requests
        if request.method.lower() != 'post':
            return True

        return super().allow_request(request, view)

    def get_cache_key(self, request, view):

        return self.cache_format % {
            'scope': self.scope,
            'ident': request.user.pk,
        }
