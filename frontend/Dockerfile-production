# Dockerfile for production

FROM node:latest

WORKDIR /code

COPY package.json ./
RUN npm install
ENV PATH="/code/node_modules/.bin:$PATH"
ENV NODE_ENV=production
COPY . .
CMD ["gulp", "deploy"]
