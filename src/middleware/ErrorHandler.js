const ErrorHandler = {
  init: function (server) {
    server.use(async (ctx, next) => {
      const { Result } = ctx.$root.tools;
      try {
        await next();
        /* 无异常，但是所有请求匹配查询后未匹配到，返回404 */
        if (ctx.status === 404) {
          if (ctx.header.accept === 'application/json') {
            /* json格式返回 */
            ctx.body = Result.fail(null, '你所访问的内容不存在', Result.PAGE_NOTFOUND);
          } else {
            ctx.body = '<h2>你所访问的内容不存在</h2>';
          }
        }
      } catch (err) {
        if (ctx.header.accept === 'application/json') {
          /* json格式返回 */
          ctx.body = Result.fail(null, err.message, Result.UNKNOWN_ERROR);
        } else {
          //将捕获的异常信息返回给浏览器
          ctx.body = err.message;
        }
      }
    });
  }
};

module.exports = { ErrorHandler };
