require("dotenv").config();
const express = require('express');
const bodyParser = require('body-parser');
const routing = require("./routes/Routing");

const app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))


app.use("/api", routing)

app.listen(process.env.PORT || 80, () => {
  console.log('Express server is up and running on http://localhost:80/');
});