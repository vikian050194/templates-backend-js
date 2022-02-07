/* eslint-disable no-console */
const { v4 } = require("uuid");

const getTime = () => {
    const now = new Date();
    return `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
};

const getLoggerForStatusCode = (statusCode, logger) => {
    if (statusCode >= 500) {
        return logger.error.bind(logger);
    }
    if (statusCode >= 400) {
        return logger.warn.bind(logger);
    }

    return logger.log.bind(logger);
};

class Logger {
    constructor(req) {
        if (req) {
            this._req = req;

            let imprintParts = [req.requestId];

            if (req.apiClient) {
                imprintParts.push(`${req.apiClient.device || ""} ${req.apiClient.platformVersion || ""}`);

                if (req.apiClient.version) {
                    imprintParts.push(`#${req.apiClient.version}`);
                }
                if (req.apiClient.locale) {
                    imprintParts.push(`${req.apiClient.locale} locale`);
                }
            }

            this._requestImprint = imprintParts.filter(x => !!x).join(", ");
        }
    }

    get _userImprint() {
        return this._req && this._req.user ? ` ${(this._req.user.role || "").toLowerCase()} ${this._req.user.id}` : "";
    }

    _log(level, ...args) {
        return console[level](getTime(), level, `[${this._requestImprint},${this._userImprint}]`, ...args);
    }

    info(...args) {
        return this._log("info", ...args);
    }

    log(...args) {
        return this._log("log", ...args);
    }

    warn(...args) {
        return this._log("warn", ...args);
    }

    error(...args) {
        return this._log("error", ...args);
    }
}

const logger = (req, res, next) => {
    req.requestId = v4();
    req.apiClient = {
        version: req.get("X-ClientVersion"),
        platformVersion: req.get("X-ClientPlatformVersion"),
        device: req.get("X-ClientDevice"),
        locale: req.get("X-ClientLocale")
    };

    const logger = new Logger(req);

    logger.info(`${req.originalUrl}`);

    const cleanup = () => {
        res.removeListener("finish", logFinished);
        res.removeListener("close", logAborted);
        res.removeListener("error", logError);
    };

    const logFinished = () => {
        cleanup();
        const log = getLoggerForStatusCode(res.statusCode, logger);
        log(`${res.statusCode} ${res.statusMessage}; ${res.get("Content-Length") || 0}b sent`);

        if (req.method === "POST") {
            log(req.body);
        }
    };

    const logAborted = () => {
        cleanup();
        logger.warn("Request aborted by the client");
    };

    const logError = err => {
        cleanup();
        logger.error(`Request pipeline error: ${err}`);
    };

    res.on("finish", logFinished);
    res.on("close", logAborted);
    res.on("error", logError);

    next();
};

module.exports = logger;