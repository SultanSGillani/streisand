FROM python:3.6-alpine3.7
ARG VERSION
ARG ENVIRONMENT_FILE

LABEL maintainer="admin@jumpcut.to"
ENV PYTHONUNBUFFERED 1
ENV PYTHONPATH /code/src

RUN mkdir -p /code/uwsgi

WORKDIR /code

COPY requirements.txt testing_requirements.txt ./uwsgi ./entrypoint.sh /code/
COPY .env /code/.env

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
    && pip install -r requirements.txt \
    && pip install -r testing_requirements.txt \
    && apk del .build-deps

COPY . .

RUN chmod +x /code/entrypoint.sh

ARG BUILD_DATE
ARG VCS_REF
LABEL org.label-schema.build-date=$BUILD_DATE \
    org.label-schema.name="Jumpcut API" \
    org.label-schema.description="A private BitTorrent tracker api written with Python, Django, & Redis" \
    org.label-schema.url="https://jumpcut.to" \
    org.label-schema.vcs-ref=$VCS_REF \
    org.label-schema.vcs-url="https://gitlab.pinigseu.xyz/jumpcut/jumpcut" \
    org.label-schema.vendor="Jumpcut.to" \
    org.label-schema.schema-version="0.0.1"

EXPOSE 8000 7070
RUN python /code/src/manage.py collectstatic --noinput

COPY entrypoint.sh /usr/local/bin/
ENTRYPOINT ["entrypoint.sh"]

CMD ["uwsgi", "--emperor",  "/code/uwsgi", "--gid", "nginx", "--die-on-term"]
