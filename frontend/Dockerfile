# Dockerfile for development

FROM node:8

WORKDIR /code

COPY package*.json ./
RUN npm install
ENV PATH="/code/node_modules/.bin:$PATH"
EXPOSE 3000
COPY . .
CMD ["gulp", "dev"]
