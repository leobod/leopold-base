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
exports.Cors = void 0;
const cors = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    ctx.set('Server', 'v1.0.0');
    ctx.set('PoweredBy', 'base');
    ctx.set('Access-Control-Allow-Origin', '*');
    ctx.set('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With');
    ctx.set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    if (ctx.method == 'OPTIONS') {
        ctx.body = 200;
    }
    else {
        yield next();
    }
});
exports.Cors = {
    /**
     * 加载Cors
     * @param app
     * @param server
     * @param config
     * @param enabled
     */
    init: function (app, server, config = {}, enabled = true) {
        server.use(cors);
    }
};
