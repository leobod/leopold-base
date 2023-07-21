"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BodyParser = void 0;
const path_1 = __importDefault(require("path"));
const koa_body_1 = __importDefault(require("koa-body"));
const koa_mount_1 = __importDefault(require("koa-mount"));
const koa_static_1 = __importDefault(require("koa-static"));
const BodyParser = {
    init: function (app) {
        app.use((0, koa_body_1.default)({
            multipart: true,
            formidable: {
                maxFileSize: 200 * 1024 * 1024,
                keepExtensions: true // 保持后缀名
            }
        }));
        app.use((0, koa_mount_1.default)('/assets', (0, koa_static_1.default)(path_1.default.join(app.$ow.options.ASSETS_PATH), {
            index: false,
            hidden: false,
            defer: false // 如果为true，则在返回next()之后进行服务，从而允许后续中间件先进行响应
        })));
    }
};
exports.BodyParser = BodyParser;
