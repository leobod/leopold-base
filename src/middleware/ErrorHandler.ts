import Router from 'koa-router';
import { MiddlewareItemType } from './index';

const errorController = new Router(); //实例化路由器

errorController
  .get('/not_found', async (ctx, next) => {
    //定义路由
    ctx.status = 404;
    ctx.body = '抱歉，我们没有此资源。';
  })
  .get('/404', async (ctx, next) => {
    ctx.status = 404;
    ctx.body = '抱歉，我们没有此资源。';
  });

const ErrorHandler: MiddlewareItemType = {
  init: function (app) {
    app.use(errorController.routes());
  }
};

export { ErrorHandler };
