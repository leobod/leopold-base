const { Leopold } = require('../../dist/index');

const leopold = new Leopold();
leopold.load();

leopold.app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    if (ctx.header.accept === 'application/json') {
      /* json格式返回 */
      ctx.body = ctx.result(null, err.message, -1);
    } else {
      /* 将捕获的异常信息返回给浏览器 */
      ctx.body = err.message;
    }
  }
});

leopold.start();
