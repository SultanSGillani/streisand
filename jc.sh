#!/bin/bash

declare -A CMDS
CMDS[build]="docker-compose build"
CMDS[up]="docker-compose up -d"
CMDS[up-non-daemon]="docker-compose up"
CMDS[start]="docker-compose start"
CMDS[stop]="docker-compose stop"
CMDS[restart]="docker-compose stop && docker-compose start"
CMDS[shell-api]="docker exec -ti api_dev bash"
CMDS[shell-db]="docker exec -ti db_dev bash"
CMDS[shell-frontend]="docker exec -ti frontend bash"
CMDS[log-api]="docker-compose logs api  "
CMDS[log-tracker]="docker-compose logs tracker  "
CMDS[log-postgres]="docker-compose logs postgres"
CMDS[log-frontend]="docker-compose logs frontend"
CMDS[m]="docker-compose run --rm api python src/manage.py"
CMDS[i]="docker-compose run --rm api invoke"
CMDS[runserver]="docker-compose up"
CMDS[cleanslate]="docker-compose run --rm api invoke clean-slate"
CMDS[test]="docker-compose run --rm api invoke run-python-tests --coverage"

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
