require("dotenv").config();
const express = require('express');
const bodyParser = require('body-parser');
const routing = require("./routes/Routing");
const houseDb = require("./database/database");

const port = 3000

const app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))


app.use("/api", routing)

app.listen(process.env.PORT || port, () => {
  console.log('Express server is up and running on http://localhost:%i/', port);
  houseDb.connect()
});
