# Dockerfile for production

FROM node:latest

WORKDIR /code

COPY package*.json ./
COPY gulpfile.js ./

RUN npm install

ENV PATH="/code/node_modules/.bin:$PATH"
EXPOSE 5000
COPY . .

RUN gulp deploy

CMD ["gulp", "connect"]


