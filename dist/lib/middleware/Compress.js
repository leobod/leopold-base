"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Compress = void 0;
const koa_compress_1 = __importDefault(require("koa-compress"));
const Compress = {
    init: function (app) {
        app.use((0, koa_compress_1.default)({
            // 只有在请求的content-type中有gzip类型，我们才会考虑压缩，因为zlib是压缩成gzip类型的
            filter: function (content_type) {
                return /text/i.test(content_type);
            },
            // 阀值，当数据超过1kb的时候，可以压缩
            threshold: 2048,
            // zlib是node的压缩模
            flush: require('zlib').Z_SYNC_FLUSH
        }));
    }
};
exports.Compress = Compress;
