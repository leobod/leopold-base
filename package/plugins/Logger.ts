import log4js from 'koa-log4';

class Logger {
  public static instance: any = null;

  public static onCreate = function (config = {}) {
    const log4jsConf = Object.assign({}, config);
    log4js.configure(log4jsConf);
    Logger.instance = log4js;
    return log4js;
  };
}

const useLogger = function () {
  return Logger.instance;
};

export { Logger, useLogger };
