const Koa = require('koa');
const app = new Koa();

app.use(async (ctx) => {
    ctx.body = 'Hello, world!';
  });

  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });