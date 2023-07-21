"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplateHandler = void 0;
const koa_view_1 = __importDefault(require("koa-view"));
const TemplateHandler = {
    init: function (app) {
        // Must be used before any router is used
        app.use((0, koa_view_1.default)(app.$ow.options.WEB_PATH));
    }
};
exports.TemplateHandler = TemplateHandler;
