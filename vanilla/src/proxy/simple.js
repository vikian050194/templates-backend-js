const port = process.env.PORT || 8000;

const http = require("http");

const backend = {
    host: "127.0.0.1",
    port: 8080
};

http.createServer((client_req, client_res) => {
    console.info("serve: " + client_req.url);

    const options = {
        hostname: backend.host,
        port: backend.port,
        path: client_req.url,
        method: client_req.method,
        headers: client_req.headers
    };

    const proxy = http.request(options, function (res) {
        client_res.writeHead(res.statusCode, res.headers);
        res.pipe(client_res, {
            end: true
        });
    });

    client_req.pipe(proxy, {
        end: true
    });
}).listen(port, () => {
    console.info("Server is listening on port", port);
});