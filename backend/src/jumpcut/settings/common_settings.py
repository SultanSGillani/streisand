"""
Django settings for jumpcut project.

For more information on this file, see
https://docs.djangoproject.com/en/dev/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/dev/ref/settings/
"""

import os
import sys
from urllib.parse import urljoin
from decouple import config
import dj_database_url

from django.utils.timezone import timedelta

AUTH_USER_MODEL = 'users.User'
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))

TESTING = sys.argv[1:2] == ['test']
# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
SECRET_KEY = config('SECRET_KEY')

DEBUG = config('DEBUG', cast=bool)
PRODUCTION = config('PRODUCTION', cast=bool)
DJANGO_APPS = (
    'www.apps.SuitConfig',  # For admin site template
    'django.contrib.admin',
    'django.contrib.admindocs',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
)

THIRD_PARTY_APPS = (
    'debug_toolbar',
    'decouple',
    'django_extensions',
    'django_su',
    'rest_framework',
    'corsheaders',
    'django_filters',
    'rest_framework_filters',
    'docs',
    'drf_yasg',
)

LOCAL_APPS = (
    'comments',
    'films',
    'forums',
    'imdb',
    'import_scripts',
    'api',
    'invites',
    'media_formats',
    'mediainfo',
    'rotten_tomatoes',
    'tests',
    'torrent_requests',
    'torrent_stats',
    'torrents',
    'tracker',
    'users',
    'wiki',
    'www',
)

INSTALLED_APPS = DJANGO_APPS + THIRD_PARTY_APPS + LOCAL_APPS

ALLOWED_HOSTS = config('ALLOWED_HOSTS', cast=lambda v: [s.strip() for s in v.split(',')])

if DEBUG and not TESTING:
    INSTALLED_APPS = DJANGO_APPS + THIRD_PARTY_APPS + LOCAL_APPS + ('bandit',)
    EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
    BANDIT_EMAIL = config('BANDIT_EMAIL', '')

EMAIL_USE_TLS = config('EMAIL_USE_TLS', cast=bool)
EMAIL_PORT = config('EMAIL_PORT', cast=int)
EMAIL_HOST = config('EMAIL_HOST')
EMAIL_HOST_USER = config('EMAIL_HOST_USER')
EMAIL_HOST_PASSWORD = config('EMAIL_HOST_PASSWORD')
DEFAULT_FROM_EMAIL = config('DEFAULT_FROM_EMAIL')
DEFAULT_REPLY_TO_EMAIL = config('DEFAULT_REPLY_TO_EMAIL')

LANGUAGE_CODE = 'en-us'
USE_I18N = True
USE_L10N = True
USE_TZ = True
TIME_ZONE = 'UTC'

REDIS_URL = config('REDIS_URL')

DATABASES = {
    'default': dj_database_url.config(
        default=config('DATABASE_URL'))
}

CELERY_ALWAYS_EAGER = config('CELERY_ALWAYS_EAGER', cast=bool)
CELERY_IGNORE_RESULT = True
CELERY_TASK_SERIALIZER = 'pickle'
CELERY_ACCEPT_CONTENT = ['pickle']
BROKER_URL = REDIS_URL + '/0'
BROKER_TRANSPORT_OPTIONS = {'fanout_patterns': True}

CACHES = {
    'default': {
        'BACKEND': 'django_redis.cache.RedisCache',
        'LOCATION': REDIS_URL + '/1',
        'TIMEOUT': None,
        'OPTIONS': {
            'CLIENT_CLASS': 'django_redis.client.DefaultClient',
        }
    }
}
if PRODUCTION:
    DATABASES['default']['CONN_MAX_AGE'] = None

SITE_ID = 1
SITE_NAME = config('SITE_NAME')
SITE_URL = config('SITE_URL')
TRACKER_URL = config('TRACKER_URL')
TRACKER_ANNOUNCE_INTERVAL = timedelta(minutes=40)
TRACKER_ANNOUNCE_URL_TEMPLATE = urljoin(TRACKER_URL, '{announce_key}/announce')
