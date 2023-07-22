function getClientIP() {
  let ip =
    this.headers['x-forwarded-for'] || // 判断是否有反向代理 IP
    this.ip ||
    this.connection.remoteAddress || // 判断 connection 的远程 IP
    this.socket.remoteAddress || // 判断后端的 socket 的 IP
    this.connection.socket.remoteAddress ||
    '';
  if (ip) {
    ip = ip.replace('::ffff:', '');
  }
  return ip;
}

const ipMiddleware = async function (ctx, next) {
  ctx.ip = getClientIP.bind(ctx);
  next();
};

const IP = {
  init: function (app) {
    app.use(ipMiddleware);
  }
};

export { IP };
