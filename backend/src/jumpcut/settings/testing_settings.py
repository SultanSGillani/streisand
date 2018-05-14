from .common_settings import *  # noqa

WSGI_APPLICATION = config('TESTING_WSGI_APPLICATION'),
FIXTURE_DIRS = ('/tests/fixtures/',)
DEBUG = config('DEBUG', cast=bool)
TEST_RUNNER = "tests.test_utils.CustomTestSuiteRunner"

ROOT_URLCONF = 'www.urls'
if DEBUG:
    MIDDLEWARE = [
        'debug_toolbar.middleware.DebugToolbarMiddleware',
    ]
    INTERNAL_IPS = [
        '10.0.2.2',
    ]
    STATIC_URL = '/static/'

DATABASES = {
    'default': dj_database_url.config(
        default=config('TESTING_DATABASE_URL'))
}  # CACHES
# ------------------------------------------------------------------------------
# https://docs.djangoproject.com/en/dev/ref/settings/#caches
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

# https://docs.djangoproject.com/en/dev/ref/settings/#email-backend
EMAIL_BACKEND = "django.core.mail.backends.locmem.EmailBackend"
# https://docs.djangoproject.com/en/dev/ref/settings/#email-host
EMAIL_HOST = "localhost"
# https://docs.djangoproject.com/en/dev/ref/settings/#email-port
EMAIL_PORT = 1025
