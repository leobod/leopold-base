const KoaBody = require('koa-body');

const BodyParser = {
  init: function (server, opts = {}) {
    server.use(
      KoaBody({
        multipart: true,
        formidable: {
          maxFileSize: 200 * 1024 * 1024, // 设置上传文件大小最大限制，默认2M
          keepExtensions: true // 保持后缀名
        }
      })
    );
  }
};

module.exports = { BodyParser };
