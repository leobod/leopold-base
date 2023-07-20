import { MiddlewareItemType } from './index';

const cors = async (ctx, next) => {
  ctx.set('Server', 'v1.0.0');
  ctx.set('PoweredBy', 'leopold');
  ctx.set('Access-Control-Allow-Origin', '*');
  ctx.set('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With');
  ctx.set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  if (ctx.method == 'OPTIONS') {
    ctx.body = 200;
  } else {
    await next();
  }
};

const Cors: MiddlewareItemType = {
  init: function (app) {
    app.use(cors);
  }
};

export { Cors };
