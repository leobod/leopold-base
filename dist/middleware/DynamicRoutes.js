"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamicRoutes = void 0;
const path = require('path');
const fs = require('fs');
function matchRoute(path, routes) {
    for (let i = 0; i < routes.length; i++) {
        const route = routes[i];
        if (route && route.expr) {
            const pattern = new RegExp('^' + route.expr.replace(/\*/g, '.*') + '$');
            if (pattern.test(path)) {
                return route;
            }
        }
    }
    return null;
}
// 示例用法
// const routePath = '/users/123';
// const routeExpressions = ['/users/*', '/posts/*', '/settings'];
const fileExtension = (val) => {
    const dotLastIndex = val.lastIndexOf('.');
    return dotLastIndex !== -1 ? val.substring(val.lastIndexOf('.') + 1) : '';
};
const _parser = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { routes = [], config } = ctx.$root;
    const ext = fileExtension(ctx.request.url).toLowerCase();
    const url = new URL('http://0.0.0.0' + ctx.request.url);
    const urlPieces = url.pathname.split('/');
    const lastPiece = urlPieces[urlPieces.length - 1];
    const matched = matchRoute(url.pathname, routes);
    if (matched && routes && routes.length > 0) {
        const exprDir = matched.expr.replaceAll('*', '');
        const mappingDir = matched.mapping ? matched.mapping.replaceAll('*', '') : exprDir;
        const filePath = url.pathname.replace(exprDir, mappingDir);
        const fileFullPath = path.join(config.path, filePath);
        if (['html', 'htm', 'txt', 'md'].indexOf(ext) !== -1) {
            if (fs.existsSync(fileFullPath)) {
                const content = fs.readFileSync(fileFullPath, 'utf8');
                ctx.body = content;
            }
            else {
                ctx.status = 400;
                yield next();
            }
        }
        else if (ext === 'js') {
            if (fs.existsSync(fileFullPath)) {
                const fn = require(fileFullPath);
                yield fn(ctx);
                yield next();
            }
            else {
                ctx.status = 400;
                yield next();
            }
        }
        else if (ext === '') {
            const fileFullPathWithExt = lastPiece ? fileFullPath + '.js' : fileFullPath + 'Application.ts';
            if (fs.existsSync(fileFullPathWithExt)) {
                const fn = require(fileFullPathWithExt);
                yield fn(ctx);
                yield next();
            }
            else {
                ctx.status = 400;
                yield next();
            }
        }
        else {
            ctx.body = 'unsupported request';
            yield next();
        }
    }
    else {
        yield next();
    }
});
exports.DynamicRoutes = {
    /**
     * 加载动态路由
     * @param app
     * @param server
     * @param config
     * @param enabled
     */
    init: function (app, server, config = { routes: [] }, enabled = true) {
        if (enabled) {
            const { routes } = config;
            const root = server.$root;
            root.routes = routes ? routes : [];
            server.use(_parser);
        }
    }
};
