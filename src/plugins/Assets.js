const p = require('path');
const KoaMount = require('koa-mount');
const KoaStatic = require('koa-static');

const Assets = {
  init: function (server, opts = {}) {
    const { path = '.' } = opts;
    server.use(
      KoaMount(
        '/assets',
        KoaStatic(p.join(process.cwd(), path), {
          index: false, // 默认为true  访问的文件为index.html  可以修改为别的文件名或者false
          hidden: false, // 是否同意传输隐藏文件
          defer: false // 如果为true，则在返回next()之后进行服务，从而允许后续中间件先进行响应
        })
      )
    );
  }
};

module.exports = { Assets };
