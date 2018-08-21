#!/bin/bash

set -eu -o
set -x

# Ensure we are in the right (root) directory
cd "${0%/*}"
cd ..

# Copy ssl certs
export NODE_ENV=${NODE_ENV}
export APIURL=${APIURL}
export LETSENCRYPT_USER_MAIL=${LETSENCRYPT_USER_MAIL}
export LEXICON_PROVIDER=${LEXICON_PROVIDER}
export LEXICON_NAMECHEAP_AUTH_TOKEN=${LEXICON_NAMECHEAP_AUTH_TOKEN}
export LEXICON_NAMECHEAP_AUTH_CLIENT_IP=${LEXICON_NAMECHEAP_AUTH_CLIENT_IP}
export LEXICON_NAMECHEAP_AUTH_USERNAME=${LEXICON_NAMECHEAP_AUTH_USERNAME}
export LEXICON_PROVIDER_OPTIONS=${LEXICON_PROVIDER_OPTIONS}

sudo cp domains.conf /etc/letsencrypt/domains.conf

sudo cp /etc/nginx/ssl/dhparam.pem /code/jumpcut/frontend/nginx/ssl/dhparam.pem

# Build production
sudo docker-compose -f production.yml build

# Build Docs
sudo docker-compose -f production.yml run --rm api sphinx-build -b html /code/docs /code/docs/_build/html

# Start Production
sudo docker-compose -f production.yml up -d --force-recreate

# Migrations
sudo docker-compose -f production.yml m migrate
