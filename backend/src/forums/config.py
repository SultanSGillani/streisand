# -*- coding: utf-8 -*-

from django.apps import AppConfig


class ForumsAppConfig(AppConfig):

    name = 'forums'
    verbose_name = 'Forums'

    def ready(self):

        # noinspection PyUnresolvedReferences
        import forums.signals.handlers  # NOQA
