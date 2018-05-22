# Do not build this directly. Use the script docker_build.sh

FROM python:3.6
ENV PYTHONUNBUFFERED 1
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        postgresql-client netcat screen vim \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /code
COPY backend/install.py ./
COPY backend/pip.conf /root/.config/pip/pip.conf

RUN export PIP_NO_BINARY=psycopg2
RUN python -m pip install --upgrade pip==9.0.3
RUN python ./install.py

COPY deployment/uwsgi ./uwsgi
COPY backend .

COPY deployment/frontend_out/bundle.js src/static/frontend/dist/
COPY deployment/frontend_out/bundle.js.map src/static/frontend/dist/

ENV DOCKER_CONTAINER=1
ENV DJANGO_ENV=DEBUG

RUN src/manage.py collectstatic -c --noinput
EXPOSE 8000 7070
ENV PYTHONPATH /code/src
ENV DJANGO_SETTINGS_MODULE jumpcut.settings.www_settings

CMD ["/usr/local/bin/uwsgi", "--emperor", "/code/uwsgi", "--die-on-term"]
