#!/bin/sh

/home/app/venv/bin/python manage.py makemigrations --noinput
/home/app/venv/bin/python manage.py migrate --noinput