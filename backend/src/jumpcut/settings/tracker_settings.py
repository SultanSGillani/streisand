# -*- coding: utf-8 -*-

from .common_settings import *


ROOT_URLCONF = 'tracker.urls'

WSGI_APPLICATION = 'jumpcut.tracker_wsgi.application'


DJANGO_APPS = [
    'django.contrib.auth',
    'django.contrib.contenttypes',
]

THIRD_PARTY_APPS = []

LOCAL_APPS = [
    'tracker',
    'users',
]

DEBUG = config('DEBUG', cast=bool)

if DEBUG:
    MIDDLEWARE = [
        'debug_toolbar.middleware.DebugToolbarMiddleware',
    ]
    DJANGO_APPS += [
        'django.contrib.staticfiles',
    ]
    THIRD_PARTY_APPS += [
        'debug_toolbar',
    ]
    INTERNAL_IPS = [
        '10.0.2.2',
    ]
    STATIC_URL = '/static/'


INSTALLED_APPS = THIRD_PARTY_APPS + DJANGO_APPS + LOCAL_APPS
