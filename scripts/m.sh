#!/bin/bash

set -eu -o
set -x

cd "${0%/*}"
cd ..

#run django management command in production mode
source ./scripts/env.sh

mkdir -p pipcache

pip3 install --cache-dir=pipcache -r requirements.txt
pip3 install --cache-dir=pipcache -r testing_requirements.txt

dcprod run -e DJANGO_SETTINGS_MODULE=$DJANGO_SETTINGS_WWW --rm api python src/manage.py $@