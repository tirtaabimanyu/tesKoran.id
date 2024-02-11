# tesKoran.id

[tesKoran.id](https://teskoran.id) is an online Pauli and Kraepelin test. We feature a minimalist design to make you focus on just taking the test. We also try to simulate the real-life environment of doing the test on paper with our vertical design. You can use the practice mode first to train your addition skill before taking the ranked test and compare your result to other users!

# Features

- Ranked mode with realistic design to make you familiar with the real test
- Practice mode where you can see the time remaining and can see your mistakes
- Thorough result graph so you can measure your consistency while doing the test
- Account system to see your overall ability and see past test results
- ...and many more to come 😁

# How to run the app

### Prerequisite:

- [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/)
- [PostgreSQL](https://www.postgresql.org/download/) server

### Steps:

1. Start the PostgreSQL server and create a database for the application
2. Duplicate the `.env.dist` file and rename it to `.env`
3. Adjust the `DATABASE_URL` variable to suit your environment
   - If you use `localhost` as the database host, you need to change it to `host.docker.internal` [(see details)](https://docs.docker.com/desktop/networking/#i-want-to-connect-from-a-container-to-a-service-on-the-host)
4. Start the docker service and run the command below

```
docker compose up --build
```

5. Open the app at [http://localhost](http://localhost)
   - You can try to log in with the default superuser account stated in `.env`

# Develop with Docker Compose

We recommend to develop using docker compose watch by running the command below

```
docker compose -f docker-compose-dev.yaml watch
```

### Check if hot reload is active

- Frontend: Try editing the `apps/frontend/pages/_app.js` file and check [http://localhost](http://localhost) if anything is updated
- Backend: Try editing the `apps/backend/numberplusbackend/views.py` file and check [http://localhost/api](http://localhost/api) if anything is updated
