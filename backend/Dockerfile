FROM python:3.6
ENV PYTHONUNBUFFERED 1
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        postgresql-client netcat \
    && rm -rf /var/lib/apt/lists/*

RUN mkdir /code

WORKDIR /code
COPY requirements.txt ./
COPY requirements.txt /
RUN pip install -r requirements.txt
COPY testing_requirements.txt ./
COPY testing_requirements.txt /
RUN pip install -r testing_requirements.txt

COPY . .

EXPOSE 8000
ENV JUMPCUT_DEBUG True
CMD ["python", "src/manage.py", "runserver_plus", "0.0.0.0:8000"]
