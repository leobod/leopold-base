const log4js = require('koa-log4');

const initLog = (mapping = './logs', opts = {}) => {
  const log4jsConf = Object.assign({}, opts);
  log4js.configure(log4jsConf);
  return log4js;
};

export const Log = {
  /**
   * 加载日志
   * @param app
   * @param server
   * @param config
   * @param enabled
   */
  init: function (app, server, config = { mapping: './logs', opts: {} }, enabled = true) {
    if (enabled && !app.Log) {
      const { mapping = './logs', opts = {} } = config;
      app.Log = initLog(mapping, opts);
      const accessLogger = () => log4js.koaLogger(log4js.getLogger('access'));
      server.use(accessLogger());
    }
  }
};
