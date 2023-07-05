# Housemate

Housemate is a centralized platform designed to help people engaged in communal
living resolve the mess with their household chores and expenses with easy-to-use
scheduling and messaging system.

## Launch the application

Our application uses docker. It has 2 containers: database and backend (TODO: Add frontend container). To launch the app you need docker-compose:

```bash
# if you have changed some DB settings and want to remove all the saved data,
# run the following commands
# docker-compose down && docker-compose rm
# docker volume rm -f housemate_mongodbdata

docker compose build
docker compose up
```

After that you can run  **docker ps** and you should see 2 containers: **mongo** with database and  **prototype-server** with backend.

You can connect to each of these containers by running

```bash
docker exec -it <containerID> bash
```

### Database

To connect to mongodb database console you should connect to the database container and run
```bash
mongosh "mongodb://houseApp:housePass@localhost:27017/houseDB"
```
### Backend

Backend is managed by docker, but you can also run it outside the container. 
To do that set environment variables like it is done in the [docker compose file](docker-compose.yml) and run the backend

```bash
export MONGODB_URL="mongodb://houseApp:housePass@localhost:27017/houseDB?retryWrites=true&w=majority"
export PORT=5000
export JWT_SECRET="+j1Q1_VVZDji|mC@m}b;(Cf~K"
export VERTICAL="test"

cd backend
npm i  # initialize js packages
nmp start  # run the project
```

**The steps above are not needed to run backend in the container!**

### Frontend

## Tests

### Backend

For some of the backend endpoints we have tests that coudl be launched with following command (with launched backend only, from the `backend` directory)
```bash
mocha backend-tests
```


When backend is running you can also send API request with curl:
```bash
curl -X POST -H "Content-Type: application/json" \
  -d '{"userName": "Mikhail", "userDescription": "The longest human", "userPassword": "qwerty", "userPicture": 123, "userSpacesId": [69, 96]}' \
  localhost:3000/api/create-user

curl -X GET -H "Content-Type: application/json" -d '{"userId": "6477d70d31b225820c91362d"}' \
  localhost:3000/api/find-user
```
