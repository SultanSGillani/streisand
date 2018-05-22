FROM python:3.6
ENV PYTHONUNBUFFERED 1
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        postgresql-client netcat \
    && rm -rf /var/lib/apt/lists/*

RUN mkdir /code

WORKDIR /code

COPY install.py ./
COPY pip.conf /root/.config/pip/pip.conf

RUN python -m pip install --upgrade pip==9.0.3
RUN export PIP_NO_BINARY=psycopg2
RUN python ./install.py

COPY . .

EXPOSE 8000
CMD ["python", "src/manage.py", "runserver_plus", "0.0.0.0:8000"]
