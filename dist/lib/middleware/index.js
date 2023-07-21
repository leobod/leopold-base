"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.middleware = void 0;
const BodyParser_1 = require("./BodyParser");
const Cors_1 = require("./Cors");
const ErrorHandler_1 = require("./ErrorHandler");
const TemplateHandler_1 = require("./TemplateHandler");
const Log4j_1 = require("./Log4j");
const middleware = [
    { name: 'BodyParser', handler: BodyParser_1.BodyParser },
    { name: 'Cors', handler: Cors_1.Cors },
    { name: 'ErrorHandler', handler: ErrorHandler_1.ErrorHandler },
    { name: 'TemplateHandler', handler: TemplateHandler_1.TemplateHandler },
    { name: 'Log4j', handler: Log4j_1.Log4j }
];
exports.middleware = middleware;
