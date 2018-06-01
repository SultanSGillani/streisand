# Dockerfile for production
FROM node:latest

WORKDIR /react

COPY package.json ./
COPY gulpfile.js ./

RUN npm install

ENV PATH="/react/node_modules/.bin:$PATH"
EXPOSE 4000
COPY . .

CMD ["gulp"]


