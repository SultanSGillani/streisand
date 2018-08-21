#!/bin/sh

python /code/src/manage.py migrate
python /code/src/manage.pycollectstatic --noinput 
uwsgi --emperor /code/uwsgi --die-on-term
