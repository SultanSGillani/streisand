#!/bin/bash

set -eu -o
set -x

# Ensure we are in the right (root) directory
cd "${0%/*}"
cd ..

# Copy ssl certs
sudo cp /etc/letsencrypt/live/pinigseu.xyz/fullchain.pem /code/jumpcut/frontend/nginx/ssl/fullchain.pem
sudo cp /etc/letsencrypt/live/pinigseu.xyz/privkey.pem /code/jumpcut/frontend/nginx/ssl/privkey.pem
sudo cp /etc/nginx/ssl/dhparam.pem /code/jumpcut/frontend/nginx/ssl/dhparam.pem

# Build production
sudo docker-compose -f production.yml -f production.yml build

# Build Docs
sudo docker-compose -f production.yml run --rm api sphinx-build -b html /code/docs /code/docs/_build/html

# Start Production
sudo docker-compose -f production.yml up -d --force-recreate

# Migrations
sudo docker-compose -f production.yml run --rm api m migrate
