#!/bin/bash

#run npm command. use this to install new packages to dev
source ./scripts/env.sh

dcprod run --rm frontend docker run --rm -v "$(pwd)/frontend_out:/code/dist/" frontend gulp deploy $@