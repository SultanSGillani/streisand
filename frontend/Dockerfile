# Dockerfile for development

FROM node:alpine
LABEL maintainer="admin@jumpcut.to"

WORKDIR /react

COPY package.json yarn.lock ./
RUN yarn

ENV PATH="/react/node_modules/.bin:$PATH"
COPY . .

ARG BUILD_DATE
ARG VCS_REF
LABEL  org.label-schema.build-date=$BUILD_DATE \
       org.label-schema.name="Jumpcut API" \
       org.label-schema.description="A private BitTorrent tracker api written with Python, Django, & Redis" \
       org.label-schema.url="https://jumpcut.to" \
       org.label-schema.vcs-ref=$VCS_REF \
       org.label-schema.vcs-url="https://gitlab.pinigseu.xyz/jumpcut/jumpcut" \
       org.label-schema.vendor="Jumpcut.to" \
       org.label-schema.schema-version="0.0.1"

EXPOSE 3000

CMD ["yarn", "run", "dev"]
