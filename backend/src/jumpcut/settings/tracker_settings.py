# -*- coding: utf-8 -*-

from .common_settings import *


ROOT_URLCONF = 'tracker.urls'

WSGI_APPLICATION = 'jumpcut.tracker_wsgi.application'


DJANGO_APPS = [
    'django.contrib.auth',
    'django.contrib.contenttypes',
]

THIRD_PARTY_APPS = [
    'knox',
    'raven.contrib.django.raven_compat',
]

MIDDLEWARE = [
    'www.middleware.XForwardedForMiddleware',
]


if DEBUG:
    DEBUG_TOOLBAR_CONFIG = {
        "SHOW_TOOLBAR_CALLBACK": lambda request: True,
    }
    MIDDLEWARE += [
        'debug_toolbar.middleware.DebugToolbarMiddleware',
    ]
    DJANGO_APPS += [
        'django.contrib.staticfiles',
    ]
    THIRD_PARTY_APPS += [
        'debug_toolbar',
        'django_extensions',
    ]
    INTERNAL_IPS = [
        '10.0.2.2',
    ]
    STATIC_URL = '/static/'
    TEMPLATES = [
        {
            'BACKEND': 'django.template.backends.django.DjangoTemplates',
            'DIRS': [],
            'APP_DIRS': True,
            'OPTIONS': {
                'context_processors': [
                    'django.template.context_processors.debug',
                    'django.template.context_processors.request',
                    'django.contrib.auth.context_processors.auth',
                    'django.contrib.messages.context_processors.messages',
                ],
            },
        },
    ]


INSTALLED_APPS = THIRD_PARTY_APPS + DJANGO_APPS + LOCAL_APPS
