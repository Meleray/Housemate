# Housemate

## How to run

Launch the database
```bash
# if you have changed some DB settings and want to remove all the saved data,
# run the following commands
# docker-compose down && docker-compose rm
# docker volume rm -f housemate_mongodbdata

docker compose build
docker compose up
```

Run the backend
```bash
cd backend
npm i  # initialize js packages
nmp start  # run the project
```

Run API endpoints tests (with launched backend only, from the `backend` directory)
```bash
mocha backend-tests
```


Send REST API requests
```bash
curl -X POST -H "Content-Type: application/json" \
  -d '{"userName": "Mikhail", "userDescription": "The longest human", "userPassword": "qwerty", "userPicture": 123, "userSpacesId": [69, 96]}' \
  localhost:3000/api/add-user

curl -X GET -H "Content-Type: application/json" -d '{"userId": "6477d70d31b225820c91362d"}' \
  localhost:3000/api/find-user
```
