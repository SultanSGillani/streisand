# Dockerfile for development

FROM node:alpine
MAINTAINER JumpCut

WORKDIR /react

COPY package.json yarn.lock .env ./

RUN yarn

ENV PATH="/react/node_modules/.bin:$PATH"

EXPOSE 3000

COPY . .

CMD ["yarn", "run", "dev"]
