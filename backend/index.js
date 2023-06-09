require("dotenv").config();
const express = require('express');
const bodyParser = require('body-parser');
const routing = require("./routes/routing");
const houseDb = require("./database/database");
const cookieParser = require("cookie-parser");

const app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cookieParser())


app.use("/api", routing)

app.listen(process.env.PORT, () => {
  console.log('Express server is up and running on http://localhost:%i/', process.env.PORT);
  houseDb.connect()
});
