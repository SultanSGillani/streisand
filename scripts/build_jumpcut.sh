#!/usr/bin/env bash

set -eu -o pipefail
set -x

IMAGE=${1:-jumpcut}


# Ensure we are in the right (root) directory
cd "${0%/*}"
cd ..

source scripts/env.sh
dcprod build
# Build frontend distribution
docker build --pull -t frontend frontend --file frontend/Dockerfile-production

# Build nginx distribution

docker build --pull -t nginx nginx --file nginx/Dockerfile

cd "${0%/*}"
cd ..
cd backend
# Build production image
docker build --pull -t ${IMAGE} -f Dockerfile-production .

