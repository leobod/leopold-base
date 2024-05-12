const views = require('koa-views');
const p = require('path');

interface TemplateHandlerConfig {
  mapping?: string;
  opts?: Object;
}

export const TemplateHandler = {
  /**
   * 记载视图渲染
   * @param app
   * @param server
   * @param config
   */
  onLoad: function (app, server, config: TemplateHandlerConfig = {}) {
    const { mapping = './template', opts = {} } = config;
    const finalOpts = Object.assign({}, opts);
    server.use(views(p.join(process.cwd(), mapping), finalOpts));
  }
};
