# Dockerfile for production
FROM node:10.9.0-alpine as builder

LABEL maintainer="admin@jumpcut.to"
WORKDIR /react

COPY package.json yarn.lock ./

RUN yarn

COPY . .

RUN yarn run build

FROM nginx:alpine

LABEL maintainer="admin@jumpcut.to"

COPY --from=builder /react/dist/* /usr/share/nginx/html/
RUN mkdir -p /etc/nginx/ssl
COPY ./nginx/ssl/* /etc/nginx/ssl/
COPY ./nginx/dhparam.sh /etc/nginx/dhparam.sh

RUN chmod +x /etc/nginx/dhparam.sh
RUN apk add --update bash \
  certbot \
  openssl openssl-dev ca-certificates \
&& rm -rf /var/cache/apk/*

RUN ln -sf /dev/stdout /var/log/nginx/access.log
RUN ln -sf /dev/stderr /var/log/nginx/error.log

COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
COPY ./nginx/mime.types /etc/nginx/mime.types
COPY ./nginx/uwsgi_params /etc/nginx/uwsgi_params

CMD ["nginx", "-g", "daemon off;"]

