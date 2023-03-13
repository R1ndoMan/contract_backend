const Koa = require('koa');
const app = new Koa();

app.use(async (ctx) => {
  ctx.body = 'Привет, мир!';
});

app.listen(3000);
console.log('Сервер запущен на порту 3000');