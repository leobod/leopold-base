const cors = async (ctx, next) => {
  ctx.set('Server', 'v1.0.0');
  ctx.set('PoweredBy', 'base');
  ctx.set('Access-Control-Allow-Origin', '*');
  ctx.set('Access-Control-Allow-Headers', '*')
  ctx.set('Access-Control-Expose-Headers', '*')
  ctx.set('Access-Control-Max-Age', 60)
  // ctx.set('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With, LZ-KEY, LZ-VAL');
  ctx.set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  if (ctx.method == 'OPTIONS') {
    ctx.body = 200;
  } else {
    await next();
  }
};

export const Cors = {
  /**
   * 加载Cors
   * @param app
   * @param server
   * @param config
   * @param enabled
   */
  init: function (app, server, config = {}, enabled = true) {
    server.use(cors);
  }
};
