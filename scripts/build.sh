#!/bin/sh
set -eu -o pipefail
set -x
#builds production images

source ./scripts/env.sh
dcprod build
./nginx/build_frontend.sh