#!/bin/bash

set -eu -o pipefail
set -x

cd /code/jumpcut

su saltman -c "git pull"
/code/jumpcut/scripts/gitlab_update.sh
