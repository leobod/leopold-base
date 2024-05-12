import { isEmpty } from '../utils/obj';
import { routePrefixMather } from '../utils/routeMatch';

interface CorsConfig {
  match?: string;
  opts?: Object;
}

export const Cors = {
  /**
   * 加载Cors
   * @param app
   * @param server
   * @param config
   */
  onLoad: function (app, server, config: CorsConfig = {}) {
    const { match = '/', opts = {} } = config;
    const matcher = routePrefixMather(match);
    server.use(async (ctx, next) => {
      if (matcher(ctx.url)) {
        if (!isEmpty(opts)) {
          for (const key in opts) {
            const val = opts[key];
            ctx.set(key, val);
          }
        }
        if (ctx.method == 'OPTIONS') {
          ctx.body = 200;
        } else {
          await next();
        }
      }
    });
  }
};
