require("dotenv").config();
const cors = require("cors");
const express = require('express');
const bodyParser = require('body-parser');
const routing = require("./routes/routing");
const houseDb = require("./database/database");
const cookieParser = require("cookie-parser");
const HttpStatus = require("http-status-codes");

const LOGGING = true;

const app = express();
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cookieParser())


function requestLoggerMiddleware(req, res, next) {
    const cyanColor = '\x1b[1;36m%s\x1b[0m'
    const url = `http://localhost:${process.env.PORT}/${req.url}`
    const message = `curl ${url} -X ${req.method.toUpperCase()} -d '${JSON.stringify(req.body)}' -H "Content-Type: application/json"`
    console.log(cyanColor, message);
    next();
}

function responseLoggerMiddleware(req, res, next) {
    // copied from https://stackoverflow.com/a/69549821/13221007
    const purpleColor = '\x1b[1;35m%s\x1b[0m'
    const redColor = '\x1b[1;31m%s\x1b[0m'

    let send = res.send;
    res.send = c => {
        const message = `StatusCode: ${res.statusCode}, ${c}`
        if (Math.floor(res.statusCode / 100) === 2){
            console.log(purpleColor, message);
        }
        else {
            console.log(redColor, message);
        }
        res.send = send;
        return res.send(c);
    }
    next();
}

if (LOGGING) {
    app.use(requestLoggerMiddleware);
    app.use(responseLoggerMiddleware);
}

const errorHandler = (err, req, res, next) => {
    if (!err) {
        return next();
    }
    res.status(HttpStatus.BAD_REQUEST).json({error: err.message});
};

app.use("/api", routing)

app.use(errorHandler);

app.listen(process.env.PORT, () => {
    console.log('Express server is up and running on http://localhost:%i/', process.env.PORT);
    houseDb.connect()
});
