const compress = require('koa-compress');

const Compress = {
  init: function (server) {
    server.use(
      compress({
        // 只有在请求的content-type中有gzip类型，我们才会考虑压缩，因为zlib是压缩成gzip类型的
        filter: function (content_type) {
          return /text/i.test(content_type);
        },
        // 阀值，当数据超过1kb的时候，可以压缩
        threshold: 2048,
        // zlib是node的压缩模
        flush: require('zlib').Z_SYNC_FLUSH
      })
    );
  }
};

module.exports = { Compress };