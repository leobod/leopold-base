const path = require('path');
const fs = require('fs');

function matchRoute(path, routes) {
  for (let i = 0; i < routes.length; i++) {
    const route = routes[i];
    const pattern = new RegExp('^' + route.replace(/\*/g, '.*') + '$');
    if (pattern.test(path)) {
      return true;
    }
  }
  return false;
}
// 示例用法
// const routePath = '/users/123';
// const routeExpressions = ['/users/*', '/posts/*', '/settings'];

const fileExtension = (val) => {
  const dotLastIndex = val.lastIndexOf('.');
  return dotLastIndex !== -1 ? val.substring(val.lastIndexOf('.') + 1) : '';
};

const _parser = async (ctx, next) => {
  const urlObj = new URL('http://0.0.0.0' + ctx.request.url);
  const urlSplits = urlObj.pathname.split('/')
  const urlLast = urlSplits[urlSplits.length - 1] ? urlSplits[urlSplits.length - 1] : 'index';
  urlSplits[urlSplits.length - 1] = '';
  const urlPrefixPath = urlSplits.join('/');
  if (matchRoute(urlPrefixPath, ctx.server.$lz.config.dynamic)) {
    let ext = fileExtension(ctx.request.url);
    let urlPrefixFullPath = path.join(ctx.server.$lz.config.droot, `${urlPrefixPath}`);
    let urlFullPath = path.join(urlPrefixFullPath, `${urlLast}`);
    if (ext === '') {
      if (fs.existsSync(urlPrefixFullPath)) {
        const controller = require(urlPrefixFullPath);
        if (controller && controller[urlLast]) {
          await controller[urlLast](ctx, next);
        } else {
          ctx.body = 'controller method not found';
          await next();
        }
      } else {
        ctx.body = 'controller not found';
        await next();
      }
    } else if (ext === 'html') {
      const content = fs.readFileSync(urlFullPath, 'utf8');
      ctx.body = content;
    } else {
      ctx.body = 'Not currently supported';
    }
  } else {
    await next();
  }
};

const DynamicParser = {
  init: function (server) {
    server.use(_parser);
  }
};

module.exports = { DynamicParser };
