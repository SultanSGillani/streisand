FROM nginx:latest


ADD ./nginx-production.conf /etc/nginx/
RUN rm -rf /etc/nginx/sites-enabled/default
RUN rm -rf /etc/nginx/conf.d
RUN mkdir /etc/nginx/conf.d/
ADD ./frontend.conf /etc/nginx/conf.d/
ADD ./api.conf /etc/nginx/conf.d/
ADD ./uwsgi_params /etc/nginx/
ADD ./setupconf.sh .
RUN ./setupconf.sh


VOLUME ./backend/src:/usr/share/nginx/django/
VOLUME ./frontend/dist:/usr/share/nginx/html/
VOLUME ./backend/src/static:/usr/share/nginx/django/static/

EXPOSE 8001 4000
