# -*- coding: utf-8 -*-

from django.apps import AppConfig


class TorrentsAppConfig(AppConfig):

    name = 'torrents'
    verbose_name = 'torrents'

    def ready(self):

        # noinspection PyUnresolvedReferences
        import torrents.signals.handlers  # NOQA
