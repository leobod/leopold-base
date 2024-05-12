import p from 'path';
import KoaMount from 'koa-mount';
import KoaStatic from 'koa-static';

interface AssetsConfig {
  match?: string;
  mapping?: string;
  opts?: Object;
}

export const Assets = {
  /**
   * 加载Assets
   * @param app
   * @param server
   * @param config  { path, mapping, opts }
   */
  onLoad: function (app, server, config: AssetsConfig = {}) {
    const { match = '/', mapping = './static', opts = {} } = config;
    const assetsOpts = Object.assign(
      {},
      // {
      //   index: 'index.html',
      //   hidden: false,
      //   defer: false
      // },
      opts
    );
    server.use(KoaMount(match, KoaStatic(p.join(process.cwd(), mapping), assetsOpts)));
  }
};
