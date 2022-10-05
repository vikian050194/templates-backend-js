const port = process.env.PORT || 8080;

const Koa = require("koa");
const logger = require("koa-logger");
const bodyParser = require("koa-bodyparser");
// const staticFiles = require("koa-static");
// const staticCache = require("koa-static-cache");
const mount = require("koa-mount");
const Router = require("@koa/router");

const app = new Koa();

app.use(logger());
app.use(bodyParser());

app.on("error", (err, ctx) => {
    console.error("server error", err, ctx);
});

const a = new Koa();

a.use(async function (ctx, next) {
    await next();
    ctx.body = "Hello";
});

const b = new Koa();

b.use(async function (ctx, next) {
    await next();
    ctx.body = "World";
});

app.use(mount("/hello", a));
app.use(mount("/world", b));

const router1 = new Router();
const router2 = new Router();

router1.get("/", function (ctx, next) {
    ctx.foo = "bar";
    return next();
});

router2.get("/", function (ctx, next) {
    ctx.baz = "qux";
    ctx.body = { foo: ctx.foo };
    return next();
});

app.use(router1.routes()).use(router2.routes());

// app.use(staticCache("src/public", { index: "index.html"}));
// app.use(staticFiles("src/public"));

app.listen(port);

console.info("Listening on port " + port);