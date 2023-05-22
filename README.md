# Housemate

## How to run

Launch the database
```bash
# if you have changed some DB settings and want to remove all the saved data,
# run the following commands
# docker-compose down && docker-compose rm
# docker volume rm -f housemate_mongodbdata

docker compose up
```

Run the backend
```bash
cd backend
npm i  # initialize js packages
nmp start  # run the project
```

Send REST API requests
```bash
curl -X POST -H "Content-Type: application/json" -d '{"email": "shpala@google.ru", "firstName": "Mikhail",  "lastName": "Konov"} ' localhost:12345/api/add-profile

curl -X GET -H "Content-Type: application/json" -d '{"email": "shpala@google.ru"}' localhost:12345/api/profile
```
