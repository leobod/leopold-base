const KoaView = require('koa-view');

const TemplateHandler = {
  init: function (server) {
    // Must be used before any router is used
    server.use(KoaView(server.$lz.config.web));
  }
};

module.exports = { TemplateHandler };
