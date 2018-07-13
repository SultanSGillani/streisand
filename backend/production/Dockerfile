FROM python:3.6-alpine3.7

MAINTAINER JumpCut
ENV PYTHONUNBUFFERED 1
ENV PYTHONPATH /code/src

RUN mkdir /code

COPY ./install_xapian.sh /tmp/install_xapian.sh
RUN chmod +x /tmp/install_xapian.sh

WORKDIR /code

COPY ./requirements.txt ./
COPY ./testing_requirements.txt ./
COPY ./uwsgi ./

RUN apk add --update --no-cache \
    jpeg-dev \
    zlib-dev \
    bash \
    libffi-dev \
    curl \
    postgresql-dev \
    libmemcached-dev \
    pcre-dev \
    mariadb-dev \
    mariadb-client-libs \
    zlib-dev \
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
&& pip install -r testing_requirements.txt

RUN /tmp/install_xapian.sh 1.4.6
RUN apk del .build-deps

COPY . .
ENV PYTHONPATH /code/src

EXPOSE 8000 7070

RUN python /code/src/manage.py collectstatic --noinput

CMD ["uwsgi", "--emperor", "/code/uwsgi", "--die-on-term"]
