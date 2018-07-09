# Dockerfile for production
FROM node:alpine as builder

MAINTAINER JumpCut

WORKDIR /react

COPY package.json yarn.lock .env ./

RUN yarn

COPY . .

RUN yarn run build

FROM nginx:alpine

MAINTAINER JumpCut

COPY --from=builder /react/dist/index.html /usr/share/nginx/html/index.html

COPY --from=builder /react/dist/app.bundle.js /usr/share/nginx/html/app.bundle.js

RUN apk add --update bash \
  certbot \
  openssl openssl-dev ca-certificates \
&& rm -rf /var/cache/apk/*

RUN ln -sf /dev/stdout /var/log/nginx/access.log
RUN ln -sf /dev/stderr /var/log/nginx/error.log

COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
COPY ./nginx/mime.types /etc/nginx/mime.types
COPY ./nginx/uwsgi_params /etc/nginx/uwsgi_params

RUN mkdir -p /etc/nginx/ssl

COPY ./nginx/ssl /etc/nginx/ssl

COPY ./nginx/conf.d/frontend.conf /etc/nginx/conf.d/default.conf
COPY ./nginx/conf.d/jumpcut.conf /etc/nginx/conf.d/jumpcut.conf
COPY ./nginx/conf.d/tracker.conf /etc/nginx/conf.d/tracker.conf

CMD ["nginx", "-g", "daemon off;"]
