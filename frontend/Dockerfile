FROM node:alpine
LABEL maintainer="admin@jumpcut.to"

WORKDIR /react

COPY package.json yarn.lock ./
RUN yarn

ENV PATH="/react/node_modules/.bin:$PATH"
COPY . .

EXPOSE 3000

CMD ["yarn", "run", "dev"]
