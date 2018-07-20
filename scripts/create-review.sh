#!/bin/bash

set -x
set -o errexit

echo "Creating Review App"

rsync -av . --delete /code/$CI_BUILD_REF_SLUG
ssh "$SSH_REVIEW_DESTINATION"
cd /code/$CI_BUILD_REF_SLUG
cp ./frontend/.env.review.template ./frontend/.env
cp ./backend/.env.review.template ./backend/.env
sudo cp -R /home/gitlab-runner/ssl/* /code/$CI_BUILD_REF_SLUG/frontend/nginx/ssl/
sudo cp -R /home/gitlab-runner/conf.d/* /code/$CI_BUILD_REF_SLUG/frontend/nginx/conf.d/
docker-compose -f docker-compose.production.yml build
docker-compose -f docker-compose.production.yml up -d --force-recreate
docker-compose -f docker-compose.production.yml run --rm api invoke setup-db
docker-compose -f docker-compose.production.yml run --rm api python src/manage.py collectstatic --noinput
docker-compose -f docker-compose.production.yml run --rm api python src/manage.py loaddata films wiki

echo "Done"
