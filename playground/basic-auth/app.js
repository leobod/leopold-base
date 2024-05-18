const { Leopold, routePrefixMather } = require('../../dist/index');
const config = require('./app.config');

const decodeBase64 = function (str) {
  return Buffer.from(str, 'base64').toString();
};

const auth = function (authorization) {
  if (authorization) {
    const authList = authorization.split(' ');
    if (authList[0] === 'Basic') {
      const info = decodeBase64(authList[1]);
      const infoList = info.split(':');
      if (infoList[0] === 'root' && infoList[1] === '123456') {
        return true;
      }
    }
  }
  return false;
};

const leopold = new Leopold(config);
leopold.load();
leopold.registerServerModule((ctx, next) => {
  const matcher = routePrefixMather('/api/');
  if (matcher(ctx.url)) {
    if (auth(ctx.headers.authorization)) {
      next();
    } else {
      ctx.set('WWW-Authenticate', `Basic realm='My Website'`);
      ctx.status = 401;
      ctx.body = 'Access denied';
    }
  } else {
    next();
  }
});

leopold.load('DynamicRoutes');
// console.log(leopold.routes);

leopold.app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    if (ctx.header.accept === 'application/json') {
      /* json格式返回 */
      ctx.body = ctx.result.fail(null, err.message, ctx.result.UNKNOWN_ERROR);
    } else {
      /* 将捕获的异常信息返回给浏览器 */
      ctx.body = err.message;
    }
  }
});

leopold.start();
