#!/bin/bash

set -eu -o pipefail
set -x

docker-compose pull
docker-compose up --no-deps -d www celery
