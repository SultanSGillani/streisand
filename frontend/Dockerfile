# Dockerfile for development

FROM node:latest

WORKDIR /react

COPY package*.json ./
RUN npm install
ENV PATH="/react/node_modules/.bin:$PATH"
ENV NODE_ENV=development
EXPOSE 3000
COPY . .
CMD ["npm", "run", "dev"]
