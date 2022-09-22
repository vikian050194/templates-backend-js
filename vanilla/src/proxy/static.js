const PORT = process.env.PORT || 8081;
const PWD = process.env.PWD;

const http = require("http");
const url = require("url");
const fs = require("fs");

var isApi = new RegExp(/\/api\/(.*)/);

const backend = {
    host: "127.0.0.1",
    port: 8080
};

http.createServer((client_req, client_res) => {
    console.info(client_req.url);

    const u = url.parse(client_req.url);
    const match = isApi.exec(u.pathname);

    if (match) {
        const options = {
            hostname: backend.host,
            port: backend.port,
            path: "/" + match[1],
            method: client_req.method,
            headers: client_req.headers
        };

        const proxy = http.request(options, (res) => {
            client_res.writeHead(res.statusCode, res.headers);
            res.pipe(client_res, {
                end: true
            });
        });

        client_req.pipe(proxy, {
            end: true
        });
    } else {
        console.info("loading file at src" + client_req.url);

        const file = client_req.url === "/" ? "/index.html" : client_req.url;
        const path = PWD + "/src" + file;
        fs.access(path, fs.F_OK, (err) => {
            if (err) {
                client_res.statusCode = 404;
                client_res.end();
            } else {
                fs.createReadStream(path, "utf8").pipe(client_res);
            }
        });
    }
}).listen(PORT, () => {
    console.info("Server is listening on port", PORT);
});