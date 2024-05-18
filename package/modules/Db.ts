import { DbFactory } from '../tools/DbFactory';

export const Db = {
  /**
   * 加载DB
   * @param root
   * @param app
   * @param config
   */
  onLoad: function (root, app, config = {}) {
    root.db = DbFactory.onCreate(config);
    app.use(async (ctx, next) => {
      ctx.db = root.db;
      await next();
    });
  }
};
