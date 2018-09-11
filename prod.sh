#!/bin/bash

declare -A CMDS
CMDS[m]="docker-compose -f production.yml run --rm api python src/manage.py"
CMDS[i]="docker-compose -f production.yml -f production.yml run --rm api invoke"
CMDS[cleanslate]="docker-compose -f production.yml run --rm api invoke clean-slate"
CMDS[test]="docker-compose -f production.yml run --rm api invoke run-python-tests --coverage"
CMDS[build]="docker-compose -f production.yml build"
CMDS[up]="docker-compose -f production.yml up -d"
CMDS[up-non-daemon]="docker-compose -f production.yml up"
CMDS[start]="docker-compose -f production.yml start"
CMDS[stop]="docker-compose -f production.yml stop"
CMDS[restart]="docker-compose -f production.yml stop && docker-compose -f production.yml start"
CMDS[shell-api]="docker exec -ti api bash"
CMDS[shell-celeryworker]="docker exec -ti celeryworker bash"
CMDS[shell-celerybeat]="docker exec -ti celerybeat bash"
CMDS[shell-db]="docker exec -ti db bash"
CMDS[shell-nginx_react]="docker exec -ti nginx_react bash"
CMDS[log-api]="docker-compose -f production.yml logs api  "
CMDS[log-celeryworker]="docker-compose -f production.yml logs celeryworker  "
CMDS[log-celerybeat]="docker-compose -f production.yml logs celerybeat  "
CMDS[log-db]="docker-compose -f production.yml logs db"
CMDS[log-nginx_react]="docker-compose -f production.yml logs nginx_react"
CMDS[makemigrations]="docker-compose -f production.yml run --rm api invoke make-migrations"

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
