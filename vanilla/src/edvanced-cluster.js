const port = process.env.PORT || 8081;

const http = require("http");
const cluster = require("cluster");
const numCPUs = require("os").cpus().length;

if (cluster.isMaster) {
    console.info(`Master ${process.pid} is running`);

    // Fork workers
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on("exit", (worker, code, signal) => {
        if (signal) {
            console.info(`worker was killed by signal: ${signal}`);
        } else if (code !== 0) {
            console.info(`worker exited with error code: ${code}`);
        } else {
            console.info(`worker ${worker.process.pid} died`);
        }
    });
} else {
    // Workers can share any TCP connection
    // In this case it is an HTTP server
    // On Windows, it is not yet possible to set up a named pipe server in a worker.
    http.createServer(function (req, res) {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.write(JSON.stringify({ hello: "world" }));
        res.end();
    }).listen(port);

    console.info(`Server is started at ${(new Date()).toLocaleString()} on port ${port} `);

    console.info(`Worker ${port} started`);
}