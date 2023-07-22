import path from 'path';
import log4js from 'koa-log4';
import { MiddlewareItemType } from './index';

const Log4j: MiddlewareItemType = {
  init: function (app) {
    const log4jsConf = {
      // 日志的输出
      appenders: {
        access: {
          type: 'dateFile',
          pattern: '-yyyy-MM-dd.log', //生成文件的规则
          alwaysIncludePattern: true, // 文件名始终以日期区分
          encoding: 'utf-8',
          filename: path.join(app.$ow.options.LOGS_PATH, 'access.log'), //生成文件名
          maxLogSize: 5 * 1000 * 1000, // 超过多少(byte)就切割
          keepFileExt: true // 切割的日志保留文件扩展名，false(默认):生成类似default.log.1文件;true:生成类似default.1.log
        },
        application: {
          type: 'dateFile',
          pattern: '-yyyy-MM-dd.log',
          alwaysIncludePattern: true,
          encoding: 'utf-8',
          filename: path.join(app.$ow.options.LOGS_PATH, 'application.log'),
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
    const accessLogger = () => log4js.koaLogger(log4js.getLogger('access')); // 记录所有访问级别的日志
    const logger = log4js.getLogger('application');
    app.use(accessLogger());
    app.use(async (ctx, next) => {
      ctx.logger = logger;
      next();
    });
  }
};

export { Log4j };
