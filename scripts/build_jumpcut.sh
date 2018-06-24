#!/bin/bash

set -eu -o
set -x

# Ensure we are in the right (root) directory
cd "${0%/*}"
cd ..

# Reformat config files for nginx
./nginx/nginxfmt.py ./nginx/nginx.conf ./nginx/conf.d/jumpcut.conf ./nginx/conf.d/tracker.conf ./nginx/conf.d/frontend.conf ./nginx/uwsgi_params ./nginx/ssl/ssl_params

# Copy ssl certs
sudo cp /etc/letsencrypt/live/pinigseu.xyz/fullchain.pem /code/jumpcut/nginx/ssl/fullchain.pem
sudo cp /etc/letsencrypt/live/pinigseu.xyz/privkey.pem /code/jumpcut/nginx/ssl/privkey.pem
sudo cp /etc/nginx/ssl/dhparam.pem /code/jumpcut/nginx/ssl/dhparam.pem

# Build production
sudo docker-compose -f docker-compose.production.yml -f docker-compose.production.yml build

# Start Production
sudo docker-compose -f docker-compose.production.yml -f docker-compose.production.yml up -d --force-recreate

# Migrations
./prod.sh m migrate
