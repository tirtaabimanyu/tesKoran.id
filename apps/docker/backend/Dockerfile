FROM python:3.10.11-slim

ARG DATABASE_URL
ARG DJANGO_SUPERUSER_EMAIL
ARG DJANGO_SUPERUSER_USERNAME
ARG DJANGO_SUPERUSER_PASSWORD

RUN python3 -m venv /opt/venv/

WORKDIR /app/
COPY ./apps/backend/ .

RUN apt-get update && \
    apt-get -y install libpq-dev gcc && \
    /opt/venv/bin/pip install pip --upgrade && \
    /opt/venv/bin/pip install -r /app/requirements.txt

RUN chmod +x /app/scripts/entrypoint.sh && \
    chmod +x /app/scripts/createsuperuser.sh && \
    chmod +x /app/scripts/migrations.sh && \
    chmod +x /app/scripts/collectstatic.sh

RUN /bin/sh /app/scripts/migrations.sh && \
    /bin/sh /app/scripts/collectstatic.sh && \
    /bin/sh /app/scripts/createsuperuser.sh

CMD ["/app/scripts/entrypoint.sh"]