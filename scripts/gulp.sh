#!/bin/bash

#run npm command. use this to install new packages to dev
source env.sh

dcdev run --rm frontend gulp deploy $@