require("dotenv").config();
const express = require('express');
const bodyParser = require('body-parser');
const routing = require("./routes/Routing");
const houseDb = require("./database/database");

const app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))


app.use("/api", routing)

const port = 12345
app.listen(process.env.PORT || 12345, () => {
  console.log('Express server is up and running on http://localhost:%i/', port);
  houseDb.connect()
});
