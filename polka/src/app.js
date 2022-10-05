const port = process.env.PORT || 8080;

const polka = require("polka");

const app = polka();

const logger = (req, res, next) => {
    console.info(`Received ${req.method} on ${req.url}`);
    next();
};

const authorize = (req, res, next) => {
    req.token = req.headers["authorization"];
    console.info(`Token ${req.token}`);
    // req.token ? next() : ((res.statusCode=401) && res.end("No token!"));
    next();
};

app.use(logger, authorize).get("*", (req, res) => {
    console.info(`user token: ${req.token}`);
    res.end("Hello, valid user");
});

const one = (req, res, next) => {
    req.hello = "world";
    next();
};

const two = (req, res, next) => {
    req.foo = "...needs better demo 😔";
    next();
};

app.use(one, two)
    .get("/users/:id", (req, res) => {
        console.info(`Hello, ${req.hello}`);
        res.end(`User: ${req.params.id}`);
    });

app.listen(port, err => {
    if (err) throw err;
    console.info("Listening on port " + port);
});
