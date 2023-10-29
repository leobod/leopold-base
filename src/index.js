const http = require('http');
const Koa = require('koa');
const path = require('path');
const WebSocket = require('ws');
const { MysqlRDB } = require('@esidecn/leopold-sqltool');
const { Result } = require('./tools/Result');
const { Log } = require('./tools/Log');
const { middleware } = require('./middleware');
const { isEmpty } = require('./utils/obj');
const templateConfig = require('./leopold.template.config');

const Leopold = function (config, init = true) {
  this._initConfig = (config = {}) => {
    this.config = Object.assign({}, templateConfig, config);
    this.config.path = path.join(process.cwd(), this.config.path);
  };

  this._initTools = () => {
    this.tools = {};
    this.tools.Result = Result;
    this.tools.Log = Log;
    /* 注册数据库工具 */
    this.database = {};
    if (!isEmpty(this.config['database'])) {
      for (const key in this.config['database']) {
        const item = this.config['database'][key];
        if (item.type === 'MYSQL' && !isEmpty(item.config)) {
          this.database[key] = new MysqlRDB(item.config);
        }
      }
    }
    this.server.use(async (ctx, next) => {
      ctx.$root = this;
      this.server.$ctx = ctx;
      await next();
    });
    const accessLogger = () => Log.koaLogger(Log.getLogger('access'));
    this.server.use(accessLogger());
  };

  this._initMiddlewares = () => {
    for (const key in middleware) {
      if (middleware[key]) {
        middleware[key].init(this.server);
      }
    }
  };

  this.run = function () {
    const { port = 8360 } = this.config;
    this.server.listen(port, () => {
      console.log(`http://localhost:${port}`);
    });
  };

  this._initConfig(config);
  const server = new Koa();
  const wrapper = http.createServer(server.callback()); /* koa脚手架创建的服务器 */
  this.server = server;
  this.server.$wrapper = wrapper;
  this._initTools();
  this._initMiddlewares();
};

module.exports = Leopold;
