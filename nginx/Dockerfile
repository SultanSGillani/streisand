FROM nginx:latest

ADD ./ssl /etc/nginx/ssl
ADD ./nginx-develop.conf /etc/nginx/
ADD ./nginx-production.conf /etc/nginx/
ADD ./django.conf /etc/nginx/conf.d/
ADD ./react.conf /etc/nginx/sites-enabled/default
ADD ./uwsgi_params /etc/nginx/
ADD ./setupconf.sh .
ADD ./frontend_out/index.html /code/dist/
ADD ./frontend_out/app.bundle.js /code/dist/
RUN ./setupconf.sh


EXPOSE 80 443
