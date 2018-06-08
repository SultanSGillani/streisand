# Dockerfile for production
FROM node:latest
MAINTAINER jumpcut
WORKDIR /react

COPY package.json ./
COPY gulpfile.js ./

RUN npm install

ENV PATH="/react/node_modules/.bin:$PATH"
COPY . .

CMD ["gulp", "deploy"]


