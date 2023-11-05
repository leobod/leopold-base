"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Log = void 0;
const p = require('path');
const log4js = require('koa-log4');
exports.Log = {
    setLog4js: function (mapping = './logs') {
        const log4jsConf = {
            // 日志的输出
            appenders: {
                access: {
                    type: 'dateFile',
                    pattern: '-yyyy-MM-dd.log',
                    alwaysIncludePattern: true,
                    encoding: 'utf-8',
                    filename: p.join(process.cwd(), mapping, 'access.log'),
                    maxLogSize: 5 * 1000 * 1000,
                    keepFileExt: true // 切割的日志保留文件扩展名，false(默认):生成类似default.log.1文件;true:生成类似default.1.log
                },
                application: {
                    type: 'dateFile',
                    pattern: '-yyyy-MM-dd.log',
                    alwaysIncludePattern: true,
                    encoding: 'utf-8',
                    filename: p.join(process.cwd(), mapping, 'application.log'),
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
        log4js.configure(log4jsConf);
        return log4js;
    },
    /**
     * 加载日志
     * @param app
     * @param server
     * @param config
     * @param enabled
     */
    init: function (app, server, config = { mapping: './logs' }, enabled = true) {
        if (enabled && !app.Log) {
            const { mapping = './logs' } = config;
            const Log = this.setLog4js(mapping);
            app.Log = Log;
            const accessLogger = () => log4js.koaLogger(log4js.getLogger('access'));
            server.use(accessLogger());
        }
    }
};
