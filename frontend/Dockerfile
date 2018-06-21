# Dockerfile for development

FROM node:latest

WORKDIR /react

COPY package.json ./
COPY gulpfile.js ./
COPY ./env ./

RUN npm install
ENV PATH="/react/node_modules/.bin:$PATH"

EXPOSE 3000

COPY . .

CMD ["npm", "run", "dev"]
