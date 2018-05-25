# Dockerfile for development

FROM node:8

WORKDIR /var/www

COPY ./package.json ./package.json
RUN npm i
ENV PATH="/var/www/node_modules/.bin:$PATH"
EXPOSE 3000
COPY . .
CMD ["npm", "run", "start"]
