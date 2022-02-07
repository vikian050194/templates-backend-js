const port = process.env.PORT || 8081;

const express = require("express");
const morgan = require("morgan");
// const logger = require("./logger1");
// const logger = require("./logger2");
// const logger = require("./logger3");
const app = express();

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

const loggerOutputPredefinedFormat = "dev";
app.use(morgan(loggerOutputPredefinedFormat));
// app.use(logger);

// app.use("/", express.static("public"));

const router = require("./router");
app.use("/", router);

app.listen(port, function () {
    console.info("Listening on port " + port);
});