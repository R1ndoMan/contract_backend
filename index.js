const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const session = require('koa-session');
const passport = require('koa-passport');
const cors = require('koa-cors');
const User = require('./models/user');
// const initializePassport = require('./passport-config');

// Инициализация приложения и маршрутизатора
const app = new Koa();
const router = new Router();

// Инициализация сессий
app.keys = ['secret']; // Установка ключей сессии
const CONFIG = {
  key: 'koa:sess',
  maxAge: 86400000,
  autoCommit: true,
  overwrite: true,
  httpOnly: true,
  signed: true,
  rolling: false,
  renew: false,
};
app.use(session(CONFIG, app));

// Инициализация Passport.js
initializePassport(passport);
app.use(passport.initialize());
app.use(passport.session());

// Регистрация маршрутов
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

router.post('/login', passport.authenticate('local'), (ctx) => {
  ctx.body = {
    message: 'Authentication successful',
    user: { id: ctx.state.user.id, name: ctx.state.user.name, email: ctx.state.user.email },
  };
});

router.get('/all-users', async (ctx) => {
  const users = await User.findAll();
  const userNames = users.map((user) => user.name);
  ctx.body = { users: userNames };
});

// Проверка авторизации пользователя
router.get('/authenticated', (ctx) => {
  if (ctx.isAuthenticated()) {
    ctx.body = {
      authenticated: true,
      user: { id: ctx.state.user.id, name: ctx.state.user.name, email: ctx.state.user.email },
    };
  } else {
    ctx.body = { authenticated: false };
  }
});

// Выход пользователя
router.get('/logout', (ctx) => {
  ctx.logout();
  ctx.body = { message: 'Logout successful' };
});

// Установка middleware
app.use(cors());
app.use(bodyParser());
app.use(router.routes());
app.use(router.allowedMethods());

// Синхронизация моделей и запуск сервера
(async () => {
  await User.sync();
  console.log('All models were synchronized successfully.');
  app.listen(3000, () => {
    console.log('Server started on port 3000');
  });
})();
