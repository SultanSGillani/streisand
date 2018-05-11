from .common_settings import *  # noqa

WSGI_APPLICATION = config('TESTING_WSGI_APPLICATION'),
FIXTURE_DIRS = ('/tests/fixtures/',)
DEBUG = config('DEBUG', cast=bool)
TEST_RUNNER = "tests.test_utils.CustomTestSuiteRunner"

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
CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.locmem.LocMemCache", "LOCATION": ""
    }
}

ROOT_URLCONF = 'www.urls'
# PASSWORDS
# ------------------------------------------------------------------------------
# https://docs.djangoproject.com/en/dev/ref/settings/#password-hashers
PASSWORD_HASHERS = ["django.contrib.auth.hashers.MD5PasswordHasher"]

# https://docs.djangoproject.com/en/dev/ref/settings/#email-backend
EMAIL_BACKEND = "django.core.mail.backends.locmem.EmailBackend"
# https://docs.djangoproject.com/en/dev/ref/settings/#email-host
EMAIL_HOST = "localhost"
# https://docs.djangoproject.com/en/dev/ref/settings/#email-port
EMAIL_PORT = 1025

# Your stuff...
# ------------------------------------------------------------------------------
