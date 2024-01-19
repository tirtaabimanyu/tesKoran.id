FROM node:20-slim

ARG NEXT_PUBLIC_API_URL

WORKDIR /app/

COPY /apps/frontend/ .

RUN npm ci

RUN npm run build

EXPOSE 3000

CMD [ "npm", "start", "3000" ]