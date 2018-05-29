#!/usr/bin/env bash

set -o errexit
set -o pipefail
set -o nounset
set -o xtrace

export C_FORCE_ROOT="true"
screen -dmS celery bash -c "cd /code/src && celery worker -A jumpcut -l info"