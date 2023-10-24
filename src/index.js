const Koa = require('koa');
const path = require('path');
const { middleware } = require('./middleware');

const Application = function (config = {}) {
  this.loadConfig = function (config) {
    this.config = config;
    this.config.source = config.root || path.join(process.cwd(), './src');
    this.config.root = config.root || path.join(process.cwd(), './www');
    this.config.static = config.static || path.join(this.config.root, './assets');
    this.config.logs = config.logs || path.join(this.config.root, './logs');
    this.config.web = config.web || path.join(this.config.root, './web');
    this.config.file = config.file || path.join(this.config.root, './file');
    this.config.droot = config.droot || this.config.root;
    this.config.dynamic = config.dynamic || [];
  };

  this.loadMiddlewares = function () {
    for (const key in middleware) {
      this.loadMiddleware(key);
    }
  };

  this.loadMiddleware = function (name) {
    if (middleware[name]) {
      middleware[name].init(this.server);
    }
  };

  this.run = function () {
    const { port = 8360 } = this.config;
    this.server.listen(port, () => {
      console.log(`http://localhost:${port}`);
    });
  };

  this.loadConfig(config);
  this.server = new Koa();
  this.server.$lz = this;
  /* 挂载koa自身 */
  this.server.use(async (ctx, next) => {
    ctx.server = this.server;
    await next();
  });
  this.loadMiddlewares();
};

module.exports = Application;
