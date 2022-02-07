/* eslint-disable no-console */
const { v4 } = require("uuid");

const getTime = () => {
    const now = new Date();
    return `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
};

const getLoggerForStatusCode = (statusCode) => {
    if (statusCode >= 500) {
        return console.error.bind(console);
    }
    if (statusCode >= 400) {
        return console.warn.bind(console);
    }

    return console.log.bind(console);
};

const logger = (req, res, next) => {
    req.requestId = v4();
    console.info(`[${req.requestId}] ${getTime()} ${req.method} ${req.originalUrl}`);

    const cleanup = () => {
        res.removeListener("finish", logFinished);
        res.removeListener("close", logAborted);
        res.removeListener("error", logError);
    };

    const logFinished = () => {
        cleanup();
        const logger = getLoggerForStatusCode(res.statusCode);
        logger(`[${req.requestId}] ${getTime()} ${req.method} ${req.originalUrl} ${res.statusCode}`);
        // logger(`${res.statusCode} ${res.statusMessage}; ${res.get("Content-Length") || 0}b sent`);

        if (req.method === "POST") {
            logger(req.body);
        }
    };

    const logAborted = () => {
        cleanup();
        console.warn("Request aborted by the client");
    };

    const logError = err => {
        cleanup();
        console.error(`Request pipeline error: ${err}`);
    };

    res.on("finish", logFinished);
    res.on("close", logAborted);
    res.on("error", logError);

    next();
};

module.exports = logger;