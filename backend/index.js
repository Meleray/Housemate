require("dotenv").config();
const express = require('express');
const bodyParser = require('body-parser');
const routing = require("./routes/Routing");
const gymvaultDb = require("./database/database");

const app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))


app.use("/api", routing)

app.listen(process.env.PORT || 12345, () => {
  console.log('Express server is up and running on http://localhost:80/');
  gymvaultDb.connect()
});
