const compress = require('koa-compress');

export const Compress = {
  /**
   * 加载Compress
   * @param app
   * @param server
   * @param config
   */
  onLoad: function (app, server, config = { opts: {} }) {
      const { opts = {} } = config;
      const finalOpts = Object.assign(
        {},
        opts
      );
      server.use(compress(finalOpts));
  }
};
