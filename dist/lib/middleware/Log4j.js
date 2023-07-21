"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Log4j = void 0;
const path_1 = __importDefault(require("path"));
const koa_log4_1 = __importDefault(require("koa-log4"));
const Log4j = {
    init: function (app) {
        const log4jsConf = {
            // 日志的输出
            appenders: {
                access: {
                    type: 'dateFile',
                    pattern: '-yyyy-MM-dd.log',
                    alwaysIncludePattern: true,
                    encoding: 'utf-8',
                    filename: path_1.default.join(app.$ow.options.LOGS_PATH, 'access.log'),
                    maxLogSize: 5 * 1000 * 1000,
                    keepFileExt: true // 切割的日志保留文件扩展名，false(默认):生成类似default.log.1文件;true:生成类似default.1.log
                },
                application: {
                    type: 'dateFile',
                    pattern: '-yyyy-MM-dd.log',
                    alwaysIncludePattern: true,
                    encoding: 'utf-8',
                    filename: path_1.default.join(app.$ow.options.LOGS_PATH, 'application.log'),
                    maxLogSize: 5 * 1000 * 1000,
                    keepFileExt: true
                },
                out: {
                    type: 'console'
                }
            },
            categories: {
                default: { appenders: ['out'], level: 'info' },
                access: { appenders: ['access'], level: 'info' },
                application: { appenders: ['application'], level: 'all' }
            }
        };
        koa_log4_1.default.configure(log4jsConf);
        const accessLogger = () => koa_log4_1.default.koaLogger(koa_log4_1.default.getLogger('access')); // 记录所有访问级别的日志
        const logger = koa_log4_1.default.getLogger('application');
        app.use(accessLogger());
        app.$ow.logger = logger;
    }
};
exports.Log4j = Log4j;
