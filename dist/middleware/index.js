"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.middleware = void 0;
const { Assets } = require('./Assets');
const { BodyParser } = require('./BodyParser');
const { Compress } = require('./Compress');
const { Cors } = require('./Cors');
const { DynamicRoutes } = require('./DynamicRoutes');
const { ErrorHandler } = require('./ErrorHandler');
const { Log } = require('./Log');
const { TemplateHandler } = require('./TemplateHandler');
exports.middleware = {
    Assets: Assets,
    BodyParser: BodyParser,
    Compress: Compress,
    Cors: Cors,
    DynamicRoutes: DynamicRoutes,
    ErrorHandler: ErrorHandler,
    Log: Log,
    TemplateHandler: TemplateHandler
};
