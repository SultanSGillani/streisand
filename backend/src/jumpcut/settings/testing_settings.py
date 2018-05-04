from .common_settings import *
from decouple import config

ROOT_URLCONF = 'tracker.urls'

WSGI_APPLICATION = 'jumpcut.testing_wsgi.application'

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
