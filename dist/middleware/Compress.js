"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Compress = void 0;
const compress = require('koa-compress');
exports.Compress = {
    /**
     * 加载Compress
     * @param app
     * @param server
     * @param config
     * @param enabled
     */
    init: function (app, server, config = { opts: {} }, enabled = true) {
        if (enabled) {
            const { opts = {} } = config;
            const finalOpts = Object.assign({}, opts, {
                // 只有在请求的content-type中有gzip类型，我们才会考虑压缩，因为zlib是压缩成gzip类型的
                filter: function (content_type) {
                    return /text/i.test(content_type);
                },
                // 阀值，当数据超过1kb的时候，可以压缩
                threshold: 2048,
                // zlib是node的压缩模
                flush: require('zlib').Z_SYNC_FLUSH
            });
            server.use(compress(finalOpts));
        }
    }
};
