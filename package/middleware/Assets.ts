import p from 'path';
import KoaMount from 'koa-mount';
import KoaStatic from 'koa-static';

export const Assets = {
  /**
   * 加载Assets
   * @param app
   * @param server
   * @param config  { path, mapping, opts }
   */
  onLoad: function (
    app,
    server,
    config: { path: string; mapping: string; opts: {} } = {
      path: '/',
      mapping: './static',
      opts: {}
    }
  ) {
    const { path = '/', mapping = './static', opts = {} } = config;
    const assetsOpts = Object.assign(
      {},
      // {
      //   index: 'index.html',
      //   hidden: false,
      //   defer: false
      // },
      opts
    );
    server.use(KoaMount(path, KoaStatic(p.join(process.cwd(), mapping), assetsOpts)));
  }
};
