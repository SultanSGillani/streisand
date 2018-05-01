#!/usr/bin/env python

import os
from celery import Celery
from .common_settings import INSTALLED_APPS
from decouple import config


DEBUG = config('DEBUG', cast=bool)
WSGI_APPLICATION = 'jumpcut.testing_wsgi.application'

SECRET_KEY = config('SECRET_KEY')

DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql_psycopg2',
            'NAME': config('TESTING_DB_NAME'),
            'USER': config('TESTING_DB_USER'),
            'PASSWORD': config('TESTING_DB_PASS'),
            'HOST': config('TESTING_DB_HOST'),
            'PORT': config('TESTING_DB_PORT')
        }
    }

# http://django-dynamic-fixture.readthedocs.org/en/latest/data_fixtures.html#custom-field-fixture
DDF_FIELD_FIXTURES = {
    'picklefield.fields.PickledObjectField': {
        'ddf_fixture': lambda: [],
    },
}
DDF_FILL_NULLABLE_FIELDS = False

# Make the tests faster by using a fast, insecure hashing algorithm
PASSWORD_HASHERS = [
    'django.contrib.auth.hashers.MD5PasswordHasher',
]

CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
        'TIMEOUT': None,
    }
}
