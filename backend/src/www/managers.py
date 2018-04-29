# -*- coding: utf-8 -*-

from django.core.cache import cache
from django.db import models


class FeatureManager(models.Manager):

    FEATURE_CACHE_KEY = 'feature_switching:{feature_name}'

    def is_enabled(self, feature_name):
        """
        Performs a read-through-cache lookup to determine whether a
        given feature is currently enabled.
        """

        cache_key = self.FEATURE_CACHE_KEY.format(feature_name=feature_name)

        # Try to fetch the result from cache
        cached_result = cache.get(cache_key)

        if cached_result is None:

            # Get the result from the database, and cache it
            cached_result = self._is_enabled(feature_name)
            cache.set(cache_key, cached_result)

        return cached_result

    def _is_enabled(self, feature_name):
        return self.filter(name=feature_name, is_enabled=True).exists()

    @classmethod
    def invalidate_cache(cls, feature_name):
        cache_key = cls.FEATURE_CACHE_KEY.format(feature_name=feature_name)
        cache.delete(cache_key)
