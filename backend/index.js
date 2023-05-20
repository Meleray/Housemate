require("dotenv").config();
const express = require('express');

const app = express();

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.listen(process.env.PORT || 80, () => {
  console.log('Express server is up and running on http://localhost:80/');
});