#!/bin/bash

set -x
set -o errexit

echo "Removing review"
cd /code/$CI_BUILD_REF_SLUG
docker-compose -f docker-compose.production.yml stop
docker container prune -f
docker-compose -f docker-compose.production.yml kill

echo "Removing exited docker containers..."
docker ps -a -f status=exited -q | xargs -r docker rm -v

echo "Removing dangling images..."
docker images --no-trunc -q -f dangling=true | xargs -r docker rmi -f

echo "Removing unused docker images"
images=($(docker images --digests | tail -n +2 | awk '{ img_id=$1; if($2!="<none>")img_id=img_id":"$2; if($3!="<none>") img_id=img_id"@"$3; print img_id}'))
containers=($(docker ps -a | tail -n +2 | awk '{print $2}'))

containers_reg=" ${containers[*]} "
remove=()

for item in ${images[@]}; do
  if [[ ! $containers_reg =~ " $item " ]]; then
    remove+=($item)
  fi
done

remove_images=" ${remove[*]} "

echo ${remove_images} | xargs -r docker rmi -f

docker image prune -f
docker network prune -f
docker volume prune -f
docker volume ls -qf dangling=true | xargs -r docker volume rm
sudo rm -rf /code/$CI_BUILD_REF_SLUG

echo "Done"
