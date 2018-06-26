# -*- coding: utf-8 -*-

from django.apps import AppConfig


class TrackerAppConfig(AppConfig):

    name = 'tracker'
    verbose_name = 'tracker'

    def ready(self):

        # noinspection PyUnresolvedReferences
        import tracker.signals.handlers  # NOQA
