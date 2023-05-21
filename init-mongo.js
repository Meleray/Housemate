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
