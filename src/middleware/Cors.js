const cors = async (ctx, next) => {
  ctx.set('Server', 'v1.0.0');
  ctx.set('PoweredBy', 'lz');
  ctx.set('Access-Control-Allow-Origin', '*');
  ctx.set('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With');
  ctx.set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  if (ctx.method == 'OPTIONS') {
    ctx.body = 200;
  } else {
    await next();
  }
};

const Cors = {
  init: function (server) {
    server.use(cors);
  }
};

module.exports = { Cors };
