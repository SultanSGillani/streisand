FROM nginx:latest


RUN rm -rf /etc/nginx/ssl
RUN mkdir /etc/nginx/ssl
ADD ./ssl /etc/nginx/ssl/
ADD ./ssl/ssl_params.conf /etc/nginx/ssl/
ADD ./nginx-develop.conf /etc/nginx/
ADD ./nginx-production.conf /etc/nginx/
RUN rm -rf /etc/nginx/sites-enabled/default
RUN rm -rf /etc/nginx/conf.d
RUN mkdir /etc/nginx/conf.d/
ADD ./gitlab.conf /etc/nginx/conf.d/
ADD ./frontend.conf /etc/nginx/conf.d/
ADD ./api.conf /etc/nginx/conf.d/
ADD ./uwsgi_params /etc/nginx/
ADD ./setupconf.sh .
RUN ./setupconf.sh


EXPOSE 80 443