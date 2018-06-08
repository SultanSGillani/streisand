# -*- coding: utf-8 -*-

from django.apps import AppConfig


class WWWAppConfig(AppConfig):

    name = 'www'
    verbose_name = 'www'

    def ready(self):

        # noinspection PyUnresolvedReferences
        import www.signals.handlers  # NOQA
