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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorHandler = void 0;
const koa_router_1 = __importDefault(require("koa-router"));
const errorController = new koa_router_1.default(); //实例化路由器
errorController
    .get('/not_found', (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    //定义路由
    ctx.status = 404;
    ctx.body = '抱歉，我们没有此资源。';
}))
    .get('/404', (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    ctx.status = 404;
    ctx.body = '抱歉，我们没有此资源。';
}));
const ErrorHandler = {
    init: function (app) {
        app.use(errorController.routes());
    }
};
exports.ErrorHandler = ErrorHandler;
