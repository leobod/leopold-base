const KoaBody = require('koa-body');

export const BodyParser = {
  /**
   * 加载BodyParser
   * @param app
   * @param server
   * @param config
   */
  onLoad: function (app, server, config = { opts: {} }) {
    const { opts = {} } = config;
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
    server.use(KoaBody(finalOpts));
  }
};
