const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const bcrypt = require('bcrypt');
const pg = require('pg');
const User = require('./models/user');

async function startServer() {
  const app = new Koa();
  const router = new Router();

  router.post('/register', async (ctx) => {
    const { name, email, password } = ctx.request.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const user = await User.create({ name, email, password: hashedPassword });
      ctx.status = 201;
      ctx.body = {
        message: 'User created',
        user: { id: user.id, name: user.name, email: user.email },
      };
    } catch (error) {
      ctx.status = 400;
      ctx.body = { message: error.message };
    }
  });

  router.post('/login', async (ctx) => {
    const { email, password } = ctx.request.body;

    const user = await User.findOne({ where: { email } });

    if (user && (await bcrypt.compare(password, user.password))) {
      ctx.body = {
        message: 'Authentication successful',
        user: { id: user.id, name: user.name, email: user.email },
      };
    } else {
      ctx.status = 401;
      ctx.body = { message: 'Invalid email/password' };
    }
  });


  router.get('/all-users', async (ctx) => {
    const users = await User.findAll();
    const userNames = users.map((user) => user.name);
    ctx.body = { users: userNames };
  });

  app.use(bodyParser());
  app.use(router.routes());
  app.use(router.allowedMethods());
  
  app.use(async (ctx)=>{
    ctx.body = "Привет! все ок!";
  });

  await User.sync();
  console.log('All models were synchronized successfully.');

  app.listen(3000, () => {
    console.log('Server started on port 3000');
  });
}

startServer();