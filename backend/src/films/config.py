# -*- coding: utf-8 -*-

from django.apps import AppConfig


class FilmsAppConfig(AppConfig):

    name = 'films'
    verbose_name = 'Films'

    def ready(self):

        # noinspection PyUnresolvedReferences
        import forums.signals.handlers  # NOQA
