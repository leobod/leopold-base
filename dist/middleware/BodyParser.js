"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BodyParser = void 0;
const KoaBody = require('koa-body');
exports.BodyParser = {
    /**
     * 加载BodyParser
     * @param app
     * @param server
     * @param config
     * @param enabled
     */
    init: function (app, server, config = { opts: {} }, enabled = true) {
        if (enabled) {
            const { opts = {} } = config;
            const finalOpts = Object.assign({}, opts, {
                multipart: true,
                formidable: {
                    maxFileSize: 200 * 1024 * 1024,
                    keepExtensions: true // 保持后缀名
                }
            });
            server.use(KoaBody(finalOpts));
        }
    }
};
