FROM nginx:latest

ADD ./nginx/ssl /etc/nginx/ssl
ADD ./nginx/nginx_nossl.conf /etc/nginx/
ADD ./nginx/nginx_ssl.conf /etc/nginx/
ADD ./nginx/django.conf /etc/nginx/conf.d/
ADD ./nginx/uwsgi_params /etc/nginx/
ADD ./frontend/dist /staticfiles
ADD ./nginx/setupconf.sh .
RUN ./setupconf.sh