FROM python:3.10.11-slim as base

ARG DATABASE_URL
ARG DJANGO_SUPERUSER_EMAIL
ARG DJANGO_SUPERUSER_USERNAME
ARG DJANGO_SUPERUSER_PASSWORD

WORKDIR /app
RUN apt-get update && apt-get -y install libpq-dev gcc

RUN useradd -ms /bin/sh -u 1001 app
USER app
RUN python3 -m venv /home/app/venv/

COPY --chown=app:app ./apps/backend/ /app/

RUN /home/app/venv/bin/pip install pip --upgrade && \
    /home/app/venv/bin/pip install -r /app/requirements.txt

RUN chmod +x /app/scripts/entrypoint.sh && \
    chmod +x /app/scripts/createsuperuser.sh && \
    chmod +x /app/scripts/migrations.sh && \
    chmod +x /app/scripts/collectstatic.sh

RUN /bin/sh /app/scripts/migrations.sh && \
    /bin/sh /app/scripts/collectstatic.sh && \
    /bin/sh /app/scripts/createsuperuser.sh

FROM base as prod
CMD ["/app/scripts/entrypoint.sh"]

FROM base as dev
CMD ["/home/app/venv/bin/python", "manage.py", "runserver", "0.0.0.0:8000"]