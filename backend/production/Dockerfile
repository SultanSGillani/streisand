FROM python:3.6
ENV PYTHONUNBUFFERED 1
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        postgresql-client netcat screen vim screen libpq-dev \
    && rm -rf /var/lib/apt/lists/*

RUN mkdir /code

WORKDIR /code

COPY ./requirements.txt ./
COPY ./testing_requirements.txt ./

RUN pip install -r requirements.txt > /dev/null
RUN pip install -r testing_requirements.txt > /dev/null

COPY ./uwsgi /code/uwsgi

COPY . .

RUN python /code/src/manage.py collectstatic --noinput

EXPOSE 8000 7070
ENV PYTHONPATH /code/src
ENV DJANGO_SETTINGS_MODULE jumpcut.settings.www_settings


CMD ["/usr/local/bin/uwsgi", "--emperor", "/code/uwsgi", "--die-on-term"]
