const http = require("http");

http.createServer(onRequest).listen(3030);

function onRequest(client_req, client_res) {
    console.info("serve: " + client_req.url);

    const options = {
        hostname: "localhost",
        port: 80,
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
}
