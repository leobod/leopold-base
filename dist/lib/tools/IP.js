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
exports.IP = void 0;
function getClientIP(req) {
    let ip = req.headers['x-forwarded-for'] || // 判断是否有反向代理 IP
        req.ip ||
        req.connection.remoteAddress || // 判断 connection 的远程 IP
        req.socket.remoteAddress || // 判断后端的 socket 的 IP
        req.connection.socket.remoteAddress ||
        '';
    if (ip) {
        ip = ip.replace('::ffff:', '');
    }
    return ip;
}
const ipMiddleware = function (ctx, next) {
    return __awaiter(this, void 0, void 0, function* () {
        ctx.app.ip = getClientIP(ctx);
        next();
    });
};
const IP = {
    init: function (app) {
        app.use(ipMiddleware);
    }
};
exports.IP = IP;
