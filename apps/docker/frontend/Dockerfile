FROM node:20-slim as base

ARG NEXT_PUBLIC_API_URL

WORKDIR /app

RUN useradd -ms /bin/sh -u 1001 app
USER app

COPY --chown=app:app /apps/frontend/ /app/
RUN npm ci

FROM base as prod
RUN npm run build
CMD ["npm", "start", "3000"]

FROM base as dev
CMD ["npm", "run", "dev"]
