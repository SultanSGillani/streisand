#!/bin/bash
set -x

echo "I will run in a loop and check that there are dhparam files, and making one or more if there are not. I will then sleep for 30 minutes"
        if [ ! -e /etc/nginx/ssl/dhparam.pem ]; then
                echo /etc/nginx/ssl/dhparam.pem does not exist, I will generate a new one.
                openssl dhparam -out /etc/nginx/ssl/dhparam.pem.tmp 4096
                mv /etc/nginx/ssl/dhparam.pem.tmp /etc/nginx/ssl/dhparam.pem
        fi
