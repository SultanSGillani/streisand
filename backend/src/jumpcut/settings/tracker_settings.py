# -*- coding: utf-8 -*-

from .common_settings import *


ROOT_URLCONF = 'tracker.urls'

WSGI_APPLICATION = 'jumpcut.tracker_wsgi.application'

DEBUG = config('DEBUG', cast=bool)

if DEBUG:
    MIDDLEWARE = [
        'debug_toolbar.middleware.DebugToolbarMiddleware',
    ]
    INSTALLED_APPS += [
        'django.contrib.staticfiles',
        'debug_toolbar.apps.DebugToolbarConfig',
    ]
    INTERNAL_IPS = [
        '10.0.2.2',
    ]
    STATIC_URL = '/static/'
