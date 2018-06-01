# -*- coding: utf-8 -*-
"""
WSGI config for jumpcut project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/dev/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application

import newrelic.agent

newrelic.agent.initialize('/code/newrelic.ini')

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "jumpcut.settings.www_settings")
application = get_wsgi_application()
application = newrelic.agent.wsgi_application()(application)
