# Dockerfile for development

FROM node:alpine
MAINTAINER JumpCut

WORKDIR /react

COPY package.json ./
COPY .env ./

RUN npm install
ENV PATH="/react/node_modules/.bin:$PATH"

EXPOSE 3000

COPY . .

CMD ["npm", "run", "dev"]
