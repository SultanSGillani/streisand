FROM python:3.6-alpine3.7

MAINTAINER JumpCut
ENV PYTHONUNBUFFERED 1
ENV PYTHONPATH /code/src

RUN mkdir /code

WORKDIR /code

COPY ./requirements.txt ./requirements.txt
COPY ./testing_requirements.txt ./testing_requirements.txt

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
    musl-dev

RUN pip install pip --upgrade
RUN pip install -r requirements.txt
RUN pip install -r testing_requirements.txt

RUN apk del .build-deps

COPY . .
ENV PYTHONPATH /code/src

EXPOSE 8000 7070
CMD ["python", "src/manage.py", "runserver_plus", "[::]:8000"]
