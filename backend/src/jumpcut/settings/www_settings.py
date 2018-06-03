# -*- coding: utf-8 -*-

from datetime import timedelta

from .common_settings import *


INTERNAL_IPS = config(
    'INTERNAL_IPS', cast=lambda v: [s.strip() for s in v.split(',')], default='10.0.0.2')

DEBUG_TOOLBAR_CONFIG = {
    "SHOW_TOOLBAR_CALLBACK": lambda request: True,
}

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.gzip.GZipMiddleware',
    'debug_toolbar.middleware.DebugToolbarMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'corsheaders.middleware.CorsPostCsrfMiddleware',
    'django.contrib.admindocs.middleware.XViewMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'www.middleware.CachedUserAuthenticationMiddleware',
    'www.middleware.LoginRequiredMiddleware',
    'www.middleware.IPHistoryMiddleware',
]

ROOT_URLCONF = 'www.urls'

LOGIN_URL = '/'
LOGIN_REDIRECT_URL = '/'
LOGIN_EXEMPT_URL_PREFIXES = (
    '/__debug__/',
    '/register/',
    '/logout/',
    '/torrents/download/',
    '/redoc/',
    '/swagger/',
    '/api/v1/',
)

PASSWORD_HASHERS = [
    'django.contrib.auth.hashers.Argon2PasswordHasher',
    'www.auth.OldSitePasswordHasher',
]

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME':
        'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME':
        'django.contrib.auth.password_validation.MinimumLengthValidator',
        'OPTIONS': {
            'min_length': 10,
        }
    },
    {
        'NAME':
        'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME':
        'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAdminUser',
    ],
    'DEFAULT_FILTER_BACKENDS':
    ('django_filters.rest_framework.DjangoFilterBackend', ),
    'PAGE_SIZE':
    50,
    'DEFAULT_PAGINATION_CLASS':
    'api.pagination.DetailPagination',
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'knox.auth.TokenAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ),
    'DEFAULT_RENDERER_CLASSES': (
        'djangorestframework_camel_case.render.CamelCaseJSONRenderer',
        'rest_framework.renderers.BrowsableAPIRenderer',
    ),
    'DEFAULT_PARSER_CLASSES':
    ('djangorestframework_camel_case.parser.CamelCaseJSONParser', ),
    'URL_FORMAT_OVERRIDE':
    None,
}

REST_KNOX = {
    'SECURE_HASH_ALGORITHM': 'cryptography.hazmat.primitives.hashes.SHA512',
    'AUTH_TOKEN_CHARACTER_LENGTH': 64,
    'TOKEN_TTL': timedelta(hours=10),
    'USER_SERIALIZER': 'api.users.serializers.OwnedUserProfileSerializer',
}

SWAGGER_SETTINGS = {
    'LOGIN_URL': '/auth/login',
    'LOGOUT_URL': '/auth/logout',
    'DEFAULT_INFO': 'api.urls.swagger_info',
    'SECURITY_DEFINITIONS': {
        'Basic': {
            'type': 'basic'
        },
    },
    'APIS_SORTER': 'alpha',
    'SUPPORTED_SUBMIT_METHODS': ['get', 'post', 'put', 'delete', 'patch'],
    'OPERATIONS_SORTER': 'alpha'
}
SWAGGER_SETTINGS.update({'VALIDATOR_URL': 'http://localhost:8189'})
REDOC_SETTINGS = {
    'LAZY_RENDERING': True,
}

SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')


# if os.getenv('DJANGO_ENV') == 'PROD':
#     CORS_ORIGIN_WHITELIST = [
#         subdomain + '.' + HOST_DOMAIN
#         for subdomain
#         in ('api', 'dev', 'static', 'www')
#     ]
# else:
#     DEBUG = True
CORS_ORIGIN_ALLOW_ALL = config('CORS_ORIGIN_ALLOW_ALL', cast=bool, default=False)

RT_API_KEY = config('RT_API_KEY', default='')
OLD_SITE_SECRET_KEY = config('OLD_SITE_HASH', default='')

AUTHENTICATION_BACKENDS = [
    # Case insensitive authentication, custom permissions
    'www.auth.CustomAuthBackend',

    # django-su
    'django_su.backends.SuBackend',
]

SESSION_ENGINE = 'django.contrib.sessions.backends.cached_db'

WSGI_APPLICATION = 'jumpcut.www_wsgi.application'

TEMPLATES = [
    {
        'BACKEND':
        'django.template.backends.django.DjangoTemplates',
        'DIRS': [
            os.path.join(BASE_DIR, 'static'),
            os.path.join(BASE_DIR, 'static/frontend/dist')
        ],
        'APP_DIRS':
        True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.template.context_processors.debug',
                'django.template.context_processors.i18n',
                'django.template.context_processors.media',
                'django.template.context_processors.static',
                'django.template.context_processors.tz',
            ],
        },
    },
]

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/dev/howto/static-files/
STATIC_URL = '/static/'
STATICFILES_DIRS = (os.path.join(BASE_DIR, 'static'), )
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
)
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'mediafiles')

ITEMS_PER_PAGE = 50

DOCS_ROOT = os.path.join(BASE_DIR, 'docs/build/html')
DOCS_ACCESS = 'staff'

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'timestamped': {
            'format': '%(levelname)-8s %(asctime)-24s %(message)s'
        },
        'simple': {
            'format': '%(levelname)-8s %(message)s'
        },
    },
    'filters': {
        'require_debug_false': {
            '()': 'django.utils.log.RequireDebugFalse'
        }
    },
    'handlers': {
        'null': {
            'level': 'DEBUG',
            'class': 'logging.NullHandler',
        },
        'mail_admins': {
            'level': 'ERROR',
            'filters': ['require_debug_false'],
            'class': 'django.utils.log.AdminEmailHandler',
        },
        'console': {
            'level': 'DEBUG',
            'class': 'logging.StreamHandler',
            'formatter': 'timestamped',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['null'],
            'propagate': True,
            'level': 'INFO',
        },
        'django.request': {
            'handlers': ['mail_admins'],
            'level': 'ERROR',
            'propagate': True,
        },
        'jumpcut': {
            'handlers': ['console'],
            'level': 'INFO',
            'propagate': True
        }
    }
}


if 'test' in sys.argv:

    TEST_RUNNER = 'tests.test_utils.CustomTestSuiteRunner'

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
