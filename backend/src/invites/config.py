# -*- coding: utf-8 -*-

from django.apps import AppConfig


class InvitesAppConfig(AppConfig):

    name = 'invites'
    verbose_name = 'invites'

    def ready(self):

        # noinspection PyUnresolvedReferences
        import invites.signals.handlers  # NOQA
