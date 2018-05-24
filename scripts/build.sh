#!/bin/bash

#builds production images

source ./scripts/env.sh
dcprod build
./nginx/build_frontend.sh