const path = require('path');
const log4js = require('koa-log4');

const Log4j = {
  init: function (server) {
    const log4jsConf = {
      // 日志的输出
      appenders: {
        access: {
          type: 'dateFile',
          pattern: '-yyyy-MM-dd.log', //生成文件的规则
          alwaysIncludePattern: true, // 文件名始终以日期区分
          encoding: 'utf-8',
          filename: path.join(server.$lz.config.logs, 'access.log'), //生成文件名
          maxLogSize: 5 * 1000 * 1000, // 超过多少(byte)就切割
          keepFileExt: true // 切割的日志保留文件扩展名，false(默认):生成类似default.log.1文件;true:生成类似default.1.log
        },
        application: {
          type: 'dateFile',
          pattern: '-yyyy-MM-dd.log',
          alwaysIncludePattern: true,
          encoding: 'utf-8',
          filename: path.join(server.$lz.config.logs, 'application.log'),
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
    const log = log4js.getLogger('application');
    server.use(accessLogger());
    server.use(async (ctx, next) => {
      ctx.server.$lz.log = ctx.server.log = ctx.log = log;
      await next();
    });
  }
};

module.exports = { Log4j };
