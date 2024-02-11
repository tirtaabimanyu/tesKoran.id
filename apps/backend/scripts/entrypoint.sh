#!/bin/sh

APP_PORT=${PORT:-8000}

/home/app/venv/bin/gunicorn --worker-tmp-dir /dev/shm numberplusbackend.wsgi --bind "0.0.0.0:${APP_PORT}"