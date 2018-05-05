# -*- coding: utf-8 -*-

from .common_settings import *


ROOT_URLCONF = 'tracker.urls'

WSGI_APPLICATION = 'jumpcut.tracker_wsgi.application'

DEBUG = config('DEBUG', cast=bool)

if DEBUG:
    MIDDLEWARE = [
        'debug_toolbar.middleware.DebugToolbarMiddleware',
    ]
    INTERNAL_IPS = [
        '10.0.2.2',
    ]
    STATIC_URL = '/static/'
