const p = require('path');
const KoaMount = require('koa-mount');
const KoaStatic = require('koa-static');

export const Assets = {
  /**
   * 加载Assets
   * @param app
   * @param server
   * @param config  { path, mapping, opts }
   * @param enabled
   */
  init: function (
    app,
    server,
    config: { path: string; mapping: string; opts: {} } = { path: '/assets', mapping: './assets', opts: {} },
    enabled = true
  ) {
    if (enabled) {
      const { path = '/', mapping = './static', opts = {} } = config;
      const assetsOpts = Object.assign(
        {},
        {
          index: 'index.html',
          hidden: false,
          defer: false
        },
        opts
      );
      server.use(KoaMount(path, KoaStatic(p.join(process.cwd(), mapping), assetsOpts)));
    }
  }
};
