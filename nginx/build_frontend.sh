#!/bin/sh
set -eu -o pipefail
set -x

IMAGE=${1:-jumpcut}

# Ensure we are in the right (root) directory
cd "${0%/*}"

# Build frontend distribution
docker build --pull -t frontend ../frontend
mkdir -p frontend_out
rm -f frontend_out/*
docker run --rm -v "$(pwd)/frontend_out:/code/dist/" frontend gulp deploy

# Build production image
docker build --pull -t ${IMAGE} -f ./Dockerfile .
