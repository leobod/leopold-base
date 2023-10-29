const KoaView = require('koa-view');
const p = require('path');

const TemplateHandler = {
  init: function (server, opts = {}) {
    const { path = '' } = opts;
    server.use(KoaView(p.join(process.cwd(), path)));
  }
};

module.exports = { TemplateHandler };
