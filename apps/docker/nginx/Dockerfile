FROM nginx:stable-alpine-slim

RUN rm /etc/nginx/conf.d/default.conf
RUN mkdir -p /var/log/nginx/healthd/ && \
    chown nginx /var/log/nginx/healthd/

COPY ./apps/docker/nginx/nginx.conf /etc/nginx/conf.d/nginx.conf

CMD ["nginx-debug", "-g", "daemon off;"]