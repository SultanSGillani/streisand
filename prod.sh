#!/bin/bash

declare -A CMDS
CMDS[m]="docker-compose -f docker-compose.production.yml run --rm api python src/manage.py"
CMDS[i]="docker-compose -f docker-compose.production.yml -f docker-compose.production.yml run --rm api invoke"
CMDS[cleanslate]="docker-compose -f docker-compose.production.yml run --rm api invoke clean-slate"
CMDS[test]="docker-compose -f docker-compose.production.yml run --rm api invoke run-python-tests --coverage"
CMDS[build]="docker-compose -f docker-compose.production.yml build"
CMDS[up]="docker-compose -f docker-compose.production.yml up -d"
CMDS[up-non-daemon]="docker-compose -f docker-compose.production.yml up"
CMDS[start]="docker-compose -f docker-compose.production.yml start"
CMDS[stop]="docker-compose -f docker-compose.production.yml stop"
CMDS[restart]="docker-compose -f docker-compose.production.yml stop && docker-compose -f docker-compose.production.yml start"
CMDS[shell-api]="docker exec -ti api bash"
CMDS[shell-db]="docker exec -ti db bash"
CMDS[shell-nginx_react]="docker exec -ti nginx_react bash"
CMDS[log-api]="docker-compose -f docker-compose.production.yml logs api  "
CMDS[log-postgres]="docker-compose -f docker-compose.production.yml logs postgres"
CMDS[log-nginx_react]="docker-compose -f docker-compose.production.yml logs nginx_react"
CMDS[makemigrations]="docker-compose -f docker-compose.production.yml run --rm api invoke make-migrations"

# Read the command
cmd="$1"
extra_args="${*:2}"

if [ ! -z "$cmd" ] && [[ ${CMDS[$cmd]} ]]
then
    exec ${CMDS[$cmd]} $extra_args
else
    # Print the commands
    for i in "${!CMDS[@]}"
    do
        printf "%-20s%s\n" "${i}:" "${CMDS[$i]}"
    done
fi
