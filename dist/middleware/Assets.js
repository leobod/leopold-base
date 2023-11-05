"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Assets = void 0;
const p = require('path');
const KoaMount = require('koa-mount');
const KoaStatic = require('koa-static');
exports.Assets = {
    /**
     * 加载Assets
     * @param app
     * @param server
     * @param config  { path, mapping, opts }
     * @param enabled
     */
    init: function (app, server, config = { path: '/assets', mapping: './assets', opts: {} }, enabled = true) {
        if (enabled) {
            const { path = '/assets', mapping = './assets', opts = {} } = config;
            const assetsOpts = Object.assign({}, opts, {
                index: true,
                hidden: false,
                defer: false
            });
            server.use(KoaMount(path, KoaStatic(p.join(process.cwd(), mapping), assetsOpts)));
        }
    }
};
