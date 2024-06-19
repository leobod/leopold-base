import http, { Server, IncomingMessage, ServerResponse } from 'http';
import Koa from 'koa';
import p from 'path';
import * as modules from '../loader';
import templateConfig from '../config';
import { UniResponseType } from '../loader/Result';
import { DbManager } from '../plugin/DbFactory';
import { ScheduleManager } from '../plugin/ScheduleFactory';
import { WebSocketServer } from 'ws';
import {MailManager} from "../plugin/MailFactory";
import {MysqlRDB} from "../plugin/MysqlRDB";
import {RedisRDB} from "../plugin/RedisRDB";

interface LeopoldConfig {
  path?: string;
  port?: number;
  modules?: Object;
}

/**
 * 应用程序
 * @type {Leopold}
 */
class Leopold {
  public static instance: Leopold | null = null;
  public config: any;
  public app: Koa;
  public server: Server<typeof IncomingMessage, typeof ServerResponse>;
  public mysql?: MysqlRDB;
  public redis?: RedisRDB;
  public db?: DbManager;
  public mail?: MailManager;
  public result?: UniResponseType;
  public schedule?: ScheduleManager;
  public wss?: WebSocketServer;

  constructor(config: LeopoldConfig = { path: '.' }) {
    // 初始化参数
    this.config = templateConfig;
    const projectPath = config.path ? config.path : '.';
    this.config.path = p.join(process.cwd(), projectPath);
    this.config.port = config.port || 8360;

    const defaultConfig = this.config.modules;
    const userConfig = config.modules || {};
    for (const key in userConfig) {
      defaultConfig[key] = Object.assign({}, defaultConfig[key], userConfig[key]);
    }
    // 初始化服务
    this.app = new Koa();
    this.server = http.createServer(this.app.callback());
    this.app.use(async (ctx, next) => {
      ctx.leopold = this;
      await next();
    });
    Leopold.instance = this;
  }

  load(arrs: Array<string> | string = 'default', config = {}) {
    const defaultMiddlewares = [
      'AppLog',
      'Mail',
      'Db',
      'Result',
      'Schedule',
      'Websocket',
      'Cors',
      'BodyParser',
      'Compress',
      'Assets'
    ];
    const modulesConfig = this.config.modules || {};
    let willLoadedKeys: Array<string> = [];
    const middlewareKeys = Object.keys(modules);
    if (typeof arrs === 'string') {
      if (arrs === 'default') willLoadedKeys = defaultMiddlewares;
      else willLoadedKeys = [arrs];
    }
    if (arrs instanceof Array) {
      for (const key of arrs) {
        if (middlewareKeys.indexOf(key) !== -1) {
          willLoadedKeys.push(key);
        }
      }
    }
    for (const key of willLoadedKeys) {
      const finalConfig = Object.assign({}, modulesConfig[key], config);
      modules[key].onLoad(this, this.app, finalConfig);
    }
  }

  registerAppModule(fn) {
    if (fn instanceof Function) {
      fn(this, this.app);
    }
  }

  registerServerModule(fn) {
    if (fn instanceof Function) {
      this.app.use(fn);
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
}

export { Leopold };
