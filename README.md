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
npm i  # initialize js packages
nmp start  # run the project
```
