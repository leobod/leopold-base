import http, { Server, IncomingMessage, ServerResponse } from 'http';
import Koa from 'koa';
import { Websocket } from '../plugins/Websocket';
import { Logger } from '../plugins/Logger';
import { Result } from '../plugins/Result';
import { Schedule } from '../plugins/Schedule';
import { Db } from '../plugins/Db';
import p from 'path';
import { middleware } from '../middleware';
import { isEmpty } from '../utils/obj';
import _ from 'lodash';
import log4js from 'koa-log4';
import templateConfig from '../leopold.template.config';

/**
 * 应用程序
 * @type {Leopold}
 */
class Leopold {
  public static instance: Leopold | null = null;

  public config: any;
  public app: Koa;
  public server: Server<typeof IncomingMessage, typeof ServerResponse>;
  public websocket: any;
  public log: any;
  public result: any;
  public schedule: any;
  public db: any;

  constructor(config = { path: '' }) {
    // 初始化参数
    this.config = _.merge({}, templateConfig, config);
    this.config.path = p.join(process.cwd(), config.path);
    // 初始化服务
    this.app = new Koa();
    this.server = http.createServer(this.app.callback());
    this.websocket = Websocket.onCreate(this.server);
    // 加载插件
    const pluginsOpts = this.config.plugins || {};
    this.log = Logger.onCreate(pluginsOpts.Logger);
    this.result = Result.onCreate(pluginsOpts.Result);
    this.schedule = Schedule.onCreate(pluginsOpts.Schedule);
    this.db = Db.onCreate(pluginsOpts.Db);
    // 加载日志
    this.app.use(async (ctx, next) => {
      ctx.leopold = this;
      ctx.log = this.log;
      ctx.result = this.result;
      ctx.schedule = this.schedule;
      ctx.db = this.db;
      await next();
    });
    const accessLogger = () => log4js.koaLogger(log4js.getLogger('access'));
    this.app.use(accessLogger());
    // 加载中间件
    const middlewaresOpts = this.config.middlewares || {};
    if (!isEmpty(middlewaresOpts)) {
      for (const key in middlewaresOpts) {
        if (middleware[key] && middlewaresOpts[key].enabled) {
          middleware[key].init(this, this.app, middlewaresOpts[key].config, middlewaresOpts[key].enabled);
        }
      }
    }
    Leopold.instance = this;
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

const useLeopold = function () {
  return Leopold.instance;
};

export { Leopold, useLeopold };
