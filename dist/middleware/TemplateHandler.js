"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplateHandler = void 0;
const KoaView = require('koa-view');
const p = require('path');
exports.TemplateHandler = {
    /**
     * 记载视图渲染
     * @param app
     * @param server
     * @param config
     * @param enabled
     */
    init: function (app, server, config = { mapping: './web' }, enabled = true) {
        if (enabled) {
            const { mapping = './web' } = config;
            server.use(KoaView(p.join(process.cwd(), mapping)));
        }
    }
};
