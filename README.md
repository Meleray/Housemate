# Housemate

Housemate is a centralized platform designed to help people engaged in communal
living resolve the mess with their household chores and expenses with easy-to-use
scheduling and messaging system.

## Launch the application

Our application uses docker. In order to launch the app you need to run docker-compose:

```bash
# if you have changed some DB settings and want to remove all the saved data,
# run the following commands
# docker-compose down && docker-compose rm
# docker volume rm -f housemate_mongodbdata

docker compose build
docker compose up
```

## Contributors
Mariia Cherepnina (MariaMsu)  
Mikhail Konov (Meleray)  
Andrian Raja Naibaho (Andrian Raja Naibaho, Andrian Naibaho)  


### Debug

You can connect to each of these containers by running

```bash
docker exec -it <containerID> bash
```

To connect to mongodb database console you should connect to the database container and run
```bash
mongosh "mongodb://houseApp:housePass@localhost:27017/houseDB"
```

Backend is managed by docker, but you can also run it outside the container. 
To do that set environment variables like it is done in the [docker compose file](docker-compose.yml) and run the backend

```bash
cd backend
sh env.sh
npm i  # initialize js packages
npm start  # run the project
```

For the backend endpoints, we have tests that could be launched with following command.
Run it with launched backend only, from the `backend` directory. 
The environment variable `VERTICAL` should be set to `"test"`
```bash
export VERTICAL="test"
mocha backend-tests
```
