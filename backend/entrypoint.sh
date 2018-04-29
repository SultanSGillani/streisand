#!/bin/sh
# Check requirements against container's version

if ! cmp -s "/requirements.txt" "/code/requirements.txt"; then
    echo ERROR: requirements.txt out of date
    echo ERROR: run docker-compose build to fix
    exit 1
fi

if ! cmp -s "/testing_requirements.txt" "/code/testing_requirements.txt"; then
    echo ERROR: testing_requirements.txt out of date
    echo ERROR: run docker-compose build to fix
    exit 1
fi

exec "$@"
