const Koa = require('koa');
const User = require('./models/user');

async function syncDatabase() {
  await User.sync();
  console.log('All models were synchronized successfully.');
}

app.use(async (ctx) => {
  ctx.body = 'Привет, мир! и привет Ермек!';
});

async function startServer() {
  const app = new Koa();
  // ... здесь настраиваем приложение ...
  await syncDatabase();
  app.listen(3000, () => {
    console.log('Server started on port 3000');
  });
}

startServer();