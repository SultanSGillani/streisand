FROM nginx:latest

RUN rm -rf /etc/nginx.conf
COPY ./nginx-production.conf /etc/nginx/nginx.conf

RUN rm -rf /etc/nginx/sites-enabled/default
RUN rm -rf /etc/nginx/conf.d

RUN mkdir /etc/nginx/conf.d/

ADD ./frontend.conf /etc/nginx/conf.d/frontend.conf
ADD ./api.conf /etc/nginx/conf.d/api.conf

ADD ./uwsgi_params /etc/nginx/uwsgi_params

EXPOSE 8001 4000
