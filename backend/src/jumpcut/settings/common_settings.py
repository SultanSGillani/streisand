# -*- coding: utf-8 -*-
"""
Django settings for jumpcut project.

For more information on this file, see
https://docs.djangoproject.com/en/dev/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/dev/ref/settings/
"""

import os
import sys
from datetime import timedelta
from urllib.parse import urljoin

import dj_database_url
from decouple import config


AUTH_USER_MODEL = 'users.User'
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))


SECRET_KEY = config('SECRET_KEY')

RAVEN_CONFIG = {
    'dsn': config('SENTRY_DSN', default=None),
}

DEBUG = config('DEBUG', cast=bool)
PRODUCTION = config('PRODUCTION', cast=bool)
TESTING = 'test' in sys.argv

ALLOWED_HOSTS = [
    'localhost',
]

HOST_IP = config('HOST_IP', default='127.0.0.1')
if HOST_IP:
    ALLOWED_HOSTS.append(HOST_IP)

HOST_DOMAIN = config('HOST_DOMAIN', default='jumpcut.to')
if HOST_DOMAIN:
    ALLOWED_HOSTS.append('.' + HOST_DOMAIN)


EMAIL_USE_TLS = config('EMAIL_USE_TLS', cast=bool, default=True)
EMAIL_PORT = config('EMAIL_PORT', cast=int, default=587)
EMAIL_HOST = config('EMAIL_HOST', default='')
EMAIL_HOST_USER = config('EMAIL_HOST_USER', default='')
EMAIL_HOST_PASSWORD = config('EMAIL_HOST_PASSWORD', default='')
DEFAULT_FROM_EMAIL = config('DEFAULT_FROM_EMAIL', default='')
DEFAULT_REPLY_TO_EMAIL = config('DEFAULT_REPLY_TO_EMAIL', default='')

LANGUAGE_CODE = 'en-us'
USE_I18N = True
USE_L10N = True
USE_TZ = True
TIME_ZONE = 'UTC'

REDIS_URL = config('REDIS_URL')
DATABASE_URL = config('DATABASE_URL')
DATABASES = {
    'default': dj_database_url.parse(DATABASE_URL)
}

if PRODUCTION:
    DATABASES['default']['CONN_MAX_AGE'] = None


CELERY_ALWAYS_EAGER = config('CELERY_ALWAYS_EAGER', cast=bool, default=True)
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


SITE_NAME = config('SITE_NAME', default='jumpcut')
SITE_URL = config('SITE_URL', default='http://localhost:8000/')
TRACKER_URL = config('TRACKER_URL', default='http://localhost:7070/')

TRACKER_ANNOUNCE_URL_TEMPLATE = urljoin(TRACKER_URL, '{announce_key}/announce/')
TORRENT_FILE_UPLOAD_MAX_SIZE = 1024 * 1024 * 5  # 5MB
TRACKER_ANNOUNCE_INTERVAL = timedelta(minutes=40)

SEED_TIME_QUOTA = timedelta(hours=96)
HNR_GRACE_PERIOD = timedelta(days=14)
DEAD_PEER_GRACE_PERIOD = timedelta(days=14)
COMPACT_PEERS_ONLY = False

LOCAL_APPS = [
    'comments',
    'films',
    'forums',
    'imdb',
    'import_scripts',
    'api',
    'invites',
    'media_formats',
    'mediainfo',
    'private_messages',
    'releases',
    'rotten_tomatoes',
    'tests',
    'torrent_requests',
    'torrent_stats',
    'torrents',
    'tracker',
    'users',
    'wiki',
    'www',
]
