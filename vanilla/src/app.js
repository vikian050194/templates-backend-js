const port = process.env.PORT || 8080;

const http = require("http");
const url = require("url");
const morgan = require("morgan");
// const finalhandler = require("finalhandler");

const loggerOutputPredefinedFormat = "dev";
const logger = morgan(loggerOutputPredefinedFormat);

http.createServer(function (req, res) {
    // var done = finalhandler(req, res);

    // eslint-disable-next-line no-unused-vars
    logger(req, res, function (err) {
        //   if (err) return done(err)

        res.writeHead(200, { "Content-Type": "application/json" });

        let data = "";

        req.on("data", chunk => {
            data += chunk;
        });

        req.on("end", () => {
            console.log(JSON.parse(data));
            res.end();
        });

        const { query } = url.parse(req.url, true);
        const { id } = query;
        const nextId = parseInt(id) + 1;

        console.info(nextId);

        const result = {
            nextId
        };

        res.write(JSON.stringify(result));
        // res.end();
    });
}).listen(port);

console.info(`Server is listening on port ${port}`);