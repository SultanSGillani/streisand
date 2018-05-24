#!/bin/bash
# start production server

source scripts/env.sh
dcprod up -d
echo "started"