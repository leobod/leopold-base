import http from 'http';
import Koa from 'koa';
import p from 'path';
import { MysqlRDB } from '../db/MysqlRDB';
import { RedisRDB } from '../db/RedisRDB';
import { Result } from '../tools/Result';
import { middleware } from '../middleware';
import { isEmpty } from '../utils/obj';
import _ from 'lodash';
const templateConfig = require('../leopold.template.config');

interface ApplicationDef {
  config: any;
  server: any;
  Result: any;
  DB: any;
  initConfig: (config?: { path: '' }) => void;
  initTools: () => void;
  initDB: () => void;
  initMiddlewares: () => void;
  initPlugins: () => void;
  start: (port?: number) => void;
}

/**
 * 应用程序
 * @type {Application}
 */
class Application implements ApplicationDef {
  config: any;
  server: any;
  Result: any;
  DB: any;

  /**
   * 初始化参数
   */
  initConfig(config = { path: '' }) {
    this.config = _.merge({}, templateConfig, config);
    this.config.path = p.join(process.cwd(), config.path);
  }

  /**
   * 加载工具
   */
  initTools() {
    if (!this.Result) {
      this.Result = Result;
      if (this.config.STATUS_CODE && isEmpty(this.config.STATUS_CODE)) {
        this.Result.STATUS_CODE = _.merge({}, this.Result.STATUS_CODE, this.config.STATUS_CODE);
      }
    }
    this.server.use(async (ctx, next) => {
      ctx.$root = this;
      await next();
    });
  }

  /**
   * 加载数据连接工具
   */
  initDB() {
    /* 注册数据库工具 */
    this.DB = {};
    if (!isEmpty(this.config['DB'])) {
      for (const key in this.config['DB']) {
        const item = this.config['DB'][key];
        if (item.type === 'MYSQL' && !isEmpty(item.config)) {
          this.DB[key] = new MysqlRDB(item.config);
        }
        if (item.type === 'REDIS' && !isEmpty(item.config)) {
          this.DB[key] = new RedisRDB(item.config);
        }
      }
    }
  }

  /**
   * 加载中间件,默认加载的
   */
  initMiddlewares() {
    if (!isEmpty(this.config['Middlewares'])) {
      const Middlewares = this.config['Middlewares'];
      for (const key in Middlewares) {
        if (middleware[key] && Middlewares[key].enabled) {
          middleware[key].init(this, this.server, Middlewares[key].config, Middlewares[key].enabled);
        }
      }
    }
  }

  /**
   * 加载插件,可自定义的
   */
  initPlugins() {
    if (!isEmpty(this.config['Plugins'])) {
      const Plugins = this.config['Plugins'];
      for (const key in Plugins) {
        try {
          Plugins[key].init(this, this.server, Plugins[key].config);
        } catch (e) {
          console.warn(e);
        }
      }
    }
  }

  /**
   * 启动应用程序
   * @param port
   */
  start(port = 8360) {
    let applicationPort = port;
    if (!port) {
      const { port = 8360 } = this.config;
      applicationPort = port;
    }
    this.config.port = applicationPort;
    this.server.listen(applicationPort, () => {
      console.log(`http://localhost:${applicationPort}`);
    });
  }

  constructor(config) {
    this.initConfig(config);
    const server = new Koa();
    const wrapper = http.createServer(server.callback()); /* koa脚手架创建的服务器 */
    this.server = server;
    this.server.$wrapper = wrapper;
    this.server.$root = this;
    this.initTools();
    this.initDB();
    this.initMiddlewares();
    this.initPlugins();
  }
}

export { ApplicationDef, Application };
