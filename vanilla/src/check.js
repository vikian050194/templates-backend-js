const http = require("http");

function checkConnection(host = "127.0.0.1", path = "", port = 80, timeout = 1000) {
    return new Promise(function (resolve, reject) {
        const timer = setTimeout(function () {
            reject("timeout");
            socket.end();
        }, timeout);

        const options = {
            hostname: host,
            port,
            path,
            agent: false
        };

        http.get('http://127.0.0.1:8003/healthz', ({ statusCode }) => {
            clearTimeout(timer);

            if (statusCode === 200) {
                resolve();
            } else {
                reject({ statusCode });
            }
        }).on('error', (e) => {
            clearTimeout(timer);
            reject(e);
        });
    });
}

const isOk = checkConnection();

console.log({isOk})