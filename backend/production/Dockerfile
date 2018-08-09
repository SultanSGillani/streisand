FROM python:3.6-alpine3.7

MAINTAINER JumpCut
ENV PYTHONUNBUFFERED 1
ENV PYTHONPATH /code/src

RUN mkdir /code

WORKDIR /code

COPY ./requirements.txt ./
COPY ./testing_requirements.txt ./
COPY ./uwsgi ./

RUN apk add --update --no-cache \
    jpeg-dev \
    zlib-dev \
    bash \
    libffi-dev \
    postgresql-dev \
    libmemcached-dev \
    pcre-dev \
    mariadb-dev \
    mariadb-client-libs \
    make \
&& addgroup -S nginx \
&& adduser -D -S -h /var/cache/nginx -s /sbin/nologin -G nginx nginx \
&& apk add --no-cache --virtual .build-deps \
    build-base \
    python3-dev \
    linux-headers \
    gcc \
    libc-dev \
    musl-dev \
&& pip install pip --upgrade \
&& pip install -r requirements.txt \
&& pip install -r testing_requirements.txt \
&& apk del .build-deps

COPY . .
ENV PYTHONPATH /code/src

EXPOSE 8000 7070

RUN python /code/src/manage.py collectstatic --noinput

CMD ["uwsgi", "--emperor", "/code/uwsgi", "--die-on-term"]
