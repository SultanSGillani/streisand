# Dockerfile for development

FROM node:8

WORKDIR /code

COPY package*.json ./
RUN npm install
ENV PATH="/code/node_modules/.bin:$PATH"
ENV NODE_ENV=development
EXPOSE 3000
COPY . .
CMD ["npm", "run", "dev"]
