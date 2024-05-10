const views = require('koa-views');
const p = require('path');

export const TemplateHandler = {
  /**
   * 记载视图渲染
   * @param app
   * @param server
   * @param config
   */
  onLoad: function (app, server, config = { mapping: './template' }) {
    const { mapping = './template' } = config;
    server.use(views(p.join(process.cwd(), mapping), { extension: 'ejs' }));
  }
};
