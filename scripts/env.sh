#!/bin/sh

export DOCKER_CONFIG_DEV=${DOCKER_CONFIG_DEV:-docker-compose.yml}
export DOCKER_CONFIG_PROD=${DOCKER_CONFIG_PROD:-docker-compose.production.yml}

export DB_USER=${DB_USER:-postgres}
export DB_NAME=${DB_NAME:-postgres}

export DJANGO_SETTINGS_COMMON=${DJANGO_SETTINGS_COMMON:-jumpcut.settings.common_settings}
export DJANGO_SETTINGS_WWW=${DJANGO_SETTINGS_WWW:-jumpcut.settings.www_settings}
export DJANGO_SETTINGS_TEST=${DJANGO_SETTINGS_TEST:-jumpcut.settings.testing_settings}
export DJANGO_SETTINGS_TRACKER=${DJANGO_SETTINGS_TEST:-jumpcut.settings.tracker_settings}


dcdev() {
    docker-compose -f docker-compose.yml -f $DOCKER_CONFIG_DEV "$@"
}

dcprod() {
    docker-compose -f docker-compose.production.yml -f $DOCKER_CONFIG_PROD "$@"
}
