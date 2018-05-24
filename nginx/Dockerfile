FROM nginx:latest

ADD ./nginx/ssl /etc/nginx/ssl
ADD ./nginx/nginx-develop.conf /etc/nginx/
ADD ./nginx/nginx-production.conf /etc/nginx/
ADD ./nginx/django.conf /etc/nginx/conf.d/
ADD ./nginx/react.conf /etc/nginx/sites-enabled/default
ADD ./nginx/uwsgi_params /etc/nginx/
ADD ./nginx/setupconf.sh .
RUN ./setupconf.sh

EXPOSE 80
