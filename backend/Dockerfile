FROM python:3.6-alpine3.7

LABEL maintainer="admin@jumpcut.to"
ENV PYTHONPATH /code/src

RUN mkdir -p /code/uwsgi

WORKDIR /code

COPY requirements/* /code/requirements/


RUN apk add --no-cache \
    git \
    jpeg-dev \
    zlib-dev \
    libffi-dev \
    bash \
    postgresql-dev \
    libmemcached-dev \
    mariadb-dev \
    mariadb-client-libs \
    make
RUN apk add --no-cache --virtual .build-deps \
    build-base \
    python3-dev \
    linux-headers \
    gcc \
    libc-dev \
    musl-dev \
    && addgroup -S nginx \
    && adduser -D -S -h /var/cache/nginx -s /sbin/nologin -G nginx nginx \
    && pip install pip --upgrade \
    && pip install -r /code/requirements/base.txt \
    && apk del .build-deps

COPY . .
RUN chmod +x /code/entrypoint.sh

RUN python /code/src/manage.py collectstatic --noinput

COPY entrypoint.sh /usr/local/bin/
ENV PYTHONPATH /code/src

CMD ["entrypoint.sh"]
