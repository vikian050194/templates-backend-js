const PORT = process.env.PORT || 8000;
const PWD = process.env.PWD;

const http = require("http");
const url = require("url");
const fs = require("fs");

const dir = "build";
const isApi = new RegExp(/\/api\/(.*)/);

const backend = {
    host: "127.0.0.1",
    port: 8080
};

const getMimeType = (ext) => {
    const types = {
        "css": "text/css",
        "html": "text/html",
        "js": "text/javascript",
        "json": "application/json",
        "svg": "image/svg+xml"
    };

    return types[ext];
};

http.createServer((client_req, client_res) => {
    console.info(`Request: ${client_req.url}`);

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
        const file = client_req.url === "/" ? "/index.html" : client_req.url;
        
        console.info(`File: ${dir}${file}`);
        
        const ext = file.split(".")[1];
        const path = `${PWD}/${dir}${file}`;
        fs.access(path, fs.F_OK, (err) => {
            if (err) {
                client_res.statusCode = 404;
                client_res.end();
            } else {
                client_res.setHeader("Content-Type", getMimeType(ext));
                fs.createReadStream(path, "utf8").pipe(client_res);
            }
        });
    }
}).listen(PORT, () => {
    console.info("Server is listening on port", PORT);
});