# -*- coding: utf-8 -*-

from .common_settings import *
import datetime

INTERNAL_IPS = [
    '10.0.2.2',
]

INSTALLED_APPS += [
    'interfaces.api_site',
    # Third party apps
    'django_su',
    'rest_framework',
    'graphene_django',
    'corsheaders',
    'django_filters',
    'rest_framework_filters',
    'docs',
    'drf_yasg',

    # Contrib apps
    'django.contrib.admin',
    'django.contrib.sessions',
    'django.contrib.humanize',
    'django.contrib.staticfiles',
    'django.contrib.messages',

    # Debug Toolbar
    'debug_toolbar',

    # Import scripts
    'import_scripts',

]
GRAPHENE = {
    'MIDDLEWARE': [
        'graphene_django.debug.DjangoDebugMiddleware',
    ],
    'SCHEMA': 'interfaces.api_site.schema.schema',
}

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.gzip.GZipMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'debug_toolbar.middleware.DebugToolbarMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'corsheaders.middleware.CorsPostCsrfMiddleware',
    'django.contrib.admindocs.middleware.XViewMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'www.middleware.CachedUserAuthenticationMiddleware',
    'www.middleware.LoginRequiredMiddleware',
    'www.middleware.IPHistoryMiddleware',

]

if PRODUCTION or TESTING:
    INSTALLED_APPS.remove('debug_toolbar')
    MIDDLEWARE.remove('debug_toolbar.middleware.DebugToolbarMiddleware')

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
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
        'OPTIONS': {
            'min_length': 10,
        }
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAdminUser',
    ], 'DEFAULT_FILTER_BACKENDS': (
        'django_filters.rest_framework.DjangoFilterBackend',
    ),
    'PAGE_SIZE': 50,
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_jwt.authentication.JSONWebTokenAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ),
    'DEFAULT_RENDERER_CLASSES': (
        'djangorestframework_camel_case.render.CamelCaseJSONRenderer',

    ),
    'DEFAULT_PARSER_CLASSES': (
        'djangorestframework_camel_case.parser.CamelCaseJSONParser',
    ),
    'URL_FORMAT_OVERRIDE': None,
}

# Default JWT preferences
JWT_AUTH = {
    'JWT_ENCODE_HANDLER':
        'rest_framework_jwt.utils.jwt_encode_handler',

    'JWT_DECODE_HANDLER':
        'rest_framework_jwt.utils.jwt_decode_handler',

    'JWT_PAYLOAD_HANDLER':
        'rest_framework_jwt.utils.jwt_payload_handler',

    'JWT_PAYLOAD_GET_USER_ID_HANDLER':
        'rest_framework_jwt.utils.jwt_get_user_id_from_payload_handler',

    'JWT_RESPONSE_PAYLOAD_HANDLER':
        'rest_framework_jwt.utils.jwt_response_payload_handler',

    'JWT_SECRET_KEY': SECRET_KEY,
    'JWT_ALGORITHM': 'HS256',
    'JWT_VERIFY': True,
    'JWT_VERIFY_EXPIRATION': True,
    'JWT_LEEWAY': 0,
    'JWT_EXPIRATION_DELTA': datetime.timedelta(seconds=3600),
    'JWT_AUDIENCE': None,
    'JWT_ISSUER': None,

    'JWT_ALLOW_REFRESH': False,
    'JWT_REFRESH_EXPIRATION_DELTA': datetime.timedelta(days=7),

    'JWT_AUTH_HEADER_PREFIX': 'JWT',
}

SWAGGER_SETTINGS = {
    'USE_SESSION_AUTH': True,
    'SECURITY_DEFINITIONS': {
        'JWT': {
            'type': 'Token',
            'in': 'header',
            'name': 'Authorization'
        }
    },
    'APIS_SORTER': 'alpha',
    'SUPPORTED_SUBMIT_METHODS': ['get', 'post', 'put', 'delete', 'patch'],
    'OPERATIONS_SORTER': 'alpha'
}


REDOC_SETTINGS = {
    'LAZY_RENDERING': True,
}

if DEBUG:
    REST_FRAMEWORK['DEFAULT_AUTHENTICATION_CLASSES'] += (
        'rest_framework.authentication.SessionAuthentication',
    )

SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

CORS_URL_REGEX = r'^/api/v1/.*$'

CORS_ORIGIN_WHITELIST = [
    subdomain + '.' + HOST_DOMAIN
    for subdomain
    in ('api', 'dev', 'static', 'www')
]

if DEBUG:
    CORS_ORIGIN_ALLOW_ALL = True

RT_API_KEY = os.environ.get('RT_API_KEY', '')
OLD_SITE_SECRET_KEY = os.environ.get('OLD_SITE_HASH', '')

AUTHENTICATION_BACKENDS = [
    # Case insensitive authentication, custom permissions
    'www.auth.CustomAuthBackend',

    # django-su
    'django_su.backends.SuBackend',
]

SESSION_ENGINE = 'django.contrib.sessions.backends.cached_db'

WSGI_APPLICATION = 'streisand.www_wsgi.application'


TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [
            os.path.join(BASE_DIR, 'static'),
            os.path.join(BASE_DIR, 'static/frontend')
        ],
        'APP_DIRS': True,
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
STATICFILES_DIRS = (
    os.path.join(BASE_DIR, 'static'),
)
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')


STATICFILES_FINDERS = [
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
    'django.contrib.staticfiles.finders.FileSystemFinder',
]

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
        'streisand': {
            'handlers': ['console'],
            'level': 'INFO',
            'propagate': True
        }
    }
}

if TESTING:
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
