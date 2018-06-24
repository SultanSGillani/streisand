# Dockerfile for production
FROM node:alpine
MAINTAINER jumpcut
WORKDIR /react

COPY package.json ./
COPY .env ./

RUN npm install

ENV PATH="/react/node_modules/.bin:$PATH"
COPY . .

CMD ["npm", "run", "build"]


