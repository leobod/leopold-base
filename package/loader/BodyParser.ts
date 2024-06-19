import { routePrefixMather } from '../utils/routeMatch';

const KoaBody = require('koa-body');

interface BodyParserConfig {
  match?: string;
  opts?: Object;
}

export const BodyParser = {
  /**
   * 加载BodyParser
   * @param root
   * @param app
   * @param config
   */
  onLoad: function (root, app, config: BodyParserConfig = {}) {
    const { match = '/', opts = {} } = config;
    const matcher = routePrefixMather(match);
    const finalOpts = Object.assign(
      {},
      // {
      //   multipart: true,
      //   formidable: {
      //     maxFileSize: 200 * 1024 * 1024, // 设置上传文件大小最大限制，默认2M
      //     keepExtensions: true // 保持后缀名
      //   }
      // },
      opts
    );
    app.use(async (ctx, next) => {
      if (matcher(ctx.url)) {
        await KoaBody(finalOpts)(ctx, next);
      } else {
        await next();
      }
    });
  }
};
