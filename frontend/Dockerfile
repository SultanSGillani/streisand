# Dockerfile for development

FROM node:8

WORKDIR /code

COPY ./package.json ./
RUN npm i
ENV PATH="/code/node_modules/.bin:$PATH"
EXPOSE 3000
COPY . .
CMD ["gulp", "deploy"]
CMD ["gulp", "dev"]
