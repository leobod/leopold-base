const view = require('koa-view');
const p = require('path');

export const TemplateHandler = {
  /**
   * 记载视图渲染
   * @param app
   * @param server
   * @param config
   * @param enabled
   */
  init: function (app, server, config = { mapping: './template' }, enabled = true) {
    if (enabled) {
      const { mapping = './template' } = config;
      server.use(view(p.join(process.cwd(), mapping)));
    }
  }
};
