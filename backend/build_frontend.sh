#!/bin/sh

set -eu pipefail
set -x

IMAGE=${1:-jumpcut}

# Ensure we are in the right (root) directory
cd "${0%/*}"
cd ..

# Build frontend distribution
docker build --pull -t frontend frontend
mkdir -p backend/frontend_out
docker run --rm -v "$(pwd)/backend/frontend_out/dist:/code/dist/" frontend gulp deploy
cp  -R backend/frontend_out/dist/* backend/src/gulpfiles/dist/
cp -R backend/src/gulpfiles/dist/* backend/src/static/frontend/dist/
docker-compose run --rm api python src/manage.py collectstatic --noinput