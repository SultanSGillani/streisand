FROM nginx:alpine

MAINTAINER JumpCut

RUN apk add --update bash \
  certbot \
  openssl openssl-dev ca-certificates \
&& rm -rf /var/cache/apk/*

RUN ln -sf /dev/stdout /var/log/nginx/access.log
RUN ln -sf /dev/stderr /var/log/nginx/error.log

COPY nginx.conf /etc/nginx.conf
COPY mime.types /etc/nginx/mime.types
COPY uwsgi_params /etc/nginx/uwsgi_params

RUN mkdir -p /etc/nginx/ssl

COPY ./ssl /etc/nginx/ssl
COPY ./conf.d /etc/nginx/conf.d

RUN rm -rf /usr/share/nginx/html/index.html

CMD ["nginx", "-g", "daemon off;"]
