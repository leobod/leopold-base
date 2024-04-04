const log4js = require('koa-log4');

const initLog = (mapping = './logs', opts = {}) => {
  const log4jsConf = Object.assign({}, opts);
  log4js.configure(log4jsConf);
  return log4js;
};

export {
  initLog
}
