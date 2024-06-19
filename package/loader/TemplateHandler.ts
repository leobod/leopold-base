const views = require('koa-views');
const p = require('path');

interface TemplateHandlerConfig {
  mapping?: string;
  opts?: Object;
}

export const TemplateHandler = {
  /**
   * 记载视图渲染
   * @param root
   * @param app
   * @param config
   */
  onLoad: function (root, app, config: TemplateHandlerConfig = {}) {
    const { mapping = './template', opts = {} } = config;
    const finalOpts = Object.assign({}, opts);
    app.use(views(p.join(process.cwd(), mapping), finalOpts));
  }
};
