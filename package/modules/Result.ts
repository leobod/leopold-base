import { ResultFactory } from '../tools/ResultFactory';

export const Result = {
  /**
   * 加载Result
   * @param root
   * @param app
   * @param config
   */
  onLoad: function (root, app, config = {}) {
    root.result = ResultFactory.onCreate(config);
    app.use(async (ctx, next) => {
      ctx.result = root.result;
      await next();
    });
  }
};
