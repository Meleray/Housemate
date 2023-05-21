// Automatically create a DB user for the app.
// This script is used in the 'docker-compose.yml'
db.createUser(
    {
        user: "houseApp",
        pwd: "housePass",
        roles: [
            {
                role: "readWrite",
                db: "houseDB"
            }
        ]
    }
);
