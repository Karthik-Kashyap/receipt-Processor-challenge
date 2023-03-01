const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;
const cors = require('cors');
const logger = require("./logger/logger");

app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    // Pass to next layer of middleware
    next();
});

app.options('*', cors({
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Access-Control-Allow-Origin', 'Access-Control-Allow-Methods', 'Access-Control-Allow-Headers', 'Allow'],
    methods: ['POST', 'DELETE', 'GET', 'PUT', 'OPTIONS']
}));

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

app.get("/", (request, response) => {
    response.json({ info: "Page does not exist. Have a good day!!" });
});

app.listen(port, () => {
    logger.info("Receipt verification initiated");
});

app.use('/receipts', require('./src/Receipts/receiptsRouter.js'));