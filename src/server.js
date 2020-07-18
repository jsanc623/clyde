const Koa = require('koa'),
  app = new Koa(),
  bodyParser = require('koa-bodyparser'),
  router = require('./router'),
  logger = require('koa-logger');

const PORT = process.env.PORT || 3000;

app.proxy = true;
app.use(bodyParser());
app.use(logger());
app.use(async (ctx, next) => {
  console.log('request received', { method: ctx.method, path: ctx.path });
  await next();
});

app.use(router.routes());

app.use(async function pageNotFound(ctx) {
  ctx.status = 404;
  ctx.type = 'json';
  ctx.body = {"error": "404"};
});

console.log(`Server listening on port: ${PORT}`);
const server = app.listen(PORT);
module.exports = server;
