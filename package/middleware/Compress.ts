import { routePrefixMather } from '../utils/routeMatch';

const compress = require('koa-compress');

interface CompressConfig {
  match?: string;
  opts?: Object;
}

export const Compress = {
  /**
   * 加载Compress
   * @param app
   * @param server
   * @param config
   */
  onLoad: function (app, server, config: CompressConfig = {}) {
    const { match = '/', opts = {} } = config;
    const matcher = routePrefixMather(match);
    const finalOpts = Object.assign({}, opts);
    server.use(async (ctx, next) => {
      if (matcher(ctx.url)) {
        await compress(finalOpts)(ctx, next);
      } else {
        await next();
      }
    });
  }
};
