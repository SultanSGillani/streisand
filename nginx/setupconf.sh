#!/bin/bash
cd /etc/nginx
rm nginx.conf
if ls ssl/*.pem &> /dev/null; then
    mv nginx_ssl.conf nginx.conf
    CRT=$(ls ssl/fullchain.pem | head -n 1)
    KEY=$(ls ssl/privkey.pem | head -n 1)
    echo "using ssl, privkey.pem=${KEY} fullchain.pem=${CRT}"
    sed -i "s#ssl/fullchain.pem#$CRT#g" /etc/nginx/nginx.conf
    sed -i "s#ssl/privkey.pem#$KEY#g" /etc/nginx/nginx.conf
else
    echo "not using ssl"
    mv /etc/nginx/nginx_nossl.conf /etc/nginx/nginx.conf
fi