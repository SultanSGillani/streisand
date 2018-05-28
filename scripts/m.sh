#!/usr/bin/env bash
chmod -x
#run django management command in production mode

source /home/sultanoffice/jumpcut/scripts/env.sh

dcprod run -e DJANGO_SETTINGS_MODULE=$DJANGO_SETTINGS_WWW --rm api python src/manage.py $@