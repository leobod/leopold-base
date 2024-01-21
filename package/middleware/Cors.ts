import {isEmpty} from "../utils/obj";

const pkg = require("../../package.json")

export const Cors = {
  /**
   * 加载Cors
   * @param app
   * @param server
   * @param config
   * @param enabled
   */
  init: function (app, server, config = {}, enabled = true) {
    if (enabled) {
      server.use(async (ctx, next) => {
        ctx.set('Lz-Version', pkg.version);
        ctx.set('PoweredBy', 'lz');
        if (!isEmpty(config)) {
          for (const key in config) {
            const val = config[key]
            ctx.set(key, val)
          }
        }
        if (ctx.method == 'OPTIONS') {
          ctx.body = 200;
        } else {
          await next();
        }
      });
    }
  }
};
