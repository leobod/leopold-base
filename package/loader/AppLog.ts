import { formatDate } from '../utils/dayjs';

export const AppLog = {
  /**
   * 加载AppLog
   * @param root
   * @param app
   * @param config
   */
  onLoad: function (root, app, config = {}) {
    app.use(async (ctx, next) => {
      const start = Date.now();
      await next();
      const end = Date.now();
      const duration = end - start;
      console.log(
        `[${formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss')}] [access] - ${ctx.method} ${ctx.url} ${ctx.response.status} ${duration} "${ctx.request.header['user-agent']}"`
      );
    });
  }
};
