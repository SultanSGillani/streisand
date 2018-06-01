#!/bin/bash

set -eu -o
set -x

# Ensure we are in the right (root) directory
cd "${0%/*}"
cd ..

# Reformat config files for nginx
./config/nginxfmt.py ./config/nginx.conf ./backend/config/jumpcut.conf ./frontend/config/frontend.conf ./config/uwsgi_params ./config/ssl/ssl_params

# Make sure www-data is the owner of these files
sudo chown www-data:www-data ./config/nginx.conf ./backend/config/jumpcut.conf ./frontend/config/frontend.conf ./config/uwsgi_params ./config/ssl/ssl_params

# Copy all files in config for nginx bare metal
sudo cp ./config/uwsgi_params /etc/nginx/
sudo cp ./config/nginx.conf /etc/nginx/
sudo cp ./config/ssl/ssl_params /etc/nginx/ssl/
sudo cp ./backend/config/jumpcut.conf /etc/nginx/conf.d/
sudo cp ./frontend/config/frontend.conf /etc/nginx/conf.d/

# Remove old bundle dist since next step builds this again
sudo rm -rf ./frontend/dist/

# Build production
docker-compose -f docker-compose.production.yml -f docker-compose.production.yml build --no-cache

# Start Production
docker-compose -f docker-compose.production.yml -f docker-compose.production.yml up -d --force-recreate

# Test nginx config files
sudo nginx -t

# Reload nginx
sudo nginx -s reload