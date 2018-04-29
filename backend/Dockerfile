FROM python:3.6

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        postgresql-client netcat \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /code
COPY requirements.txt ./
RUN pip install -r requirements.txt
COPY testing_requirements.txt ./
RUN pip install -r testing_requirements.txt

COPY . .
COPY tasks.py .

EXPOSE 8000
ENV STREISAND_DEBUG True
CMD ["python", "src/manage.py", "runserver_plus", "0.0.0.0:8000"]
