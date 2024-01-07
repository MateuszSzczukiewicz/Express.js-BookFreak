"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var cors = require("cors");
var bodyParser = require("body-parser");
require("express-async-errors");
var config_1 = require("./app/config");
var errors_1 = require("./app/utils/errors");
var app = express();
app.use(bodyParser.json());
app.use(cors({
    origin: "http://localhost:".concat(config_1.config.port),
}));
app.use(express.json());
app.use(errors_1.handleError);
app.listen(config_1.config.port, function () {
    console.log("Listening on http://localhost:".concat(config_1.config.port));
});
