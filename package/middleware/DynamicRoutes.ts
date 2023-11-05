const path = require('path');
const fs = require('fs');

function matchRoute(path, routes) {
  for (let i = 0; i < routes.length; i++) {
    const route = routes[i];
    if (route && route.expr) {
      const pattern = new RegExp('^' + route.expr.replace(/\*/g, '.*') + '$');
      if (pattern.test(path)) {
        return route;
      }
    }
  }
  return null;
}
// 示例用法
// const routePath = '/users/123';
// const routeExpressions = ['/users/*', '/posts/*', '/settings'];

const fileExtension = (val) => {
  const dotLastIndex = val.lastIndexOf('.');
  return dotLastIndex !== -1 ? val.substring(val.lastIndexOf('.') + 1) : '';
};

const _parser = async (ctx, next) => {
  const { routes = [], config } = ctx.$root;
  const ext = fileExtension(ctx.request.url).toLowerCase();
  const url = new URL('http://0.0.0.0' + ctx.request.url);
  const urlPieces = url.pathname.split('/');
  const lastPiece = urlPieces[urlPieces.length - 1];
  const matched = matchRoute(url.pathname, routes);
  if (matched && routes && routes.length > 0) {
    const exprDir = matched.expr.replaceAll('*', '');
    const mappingDir = matched.mapping ? matched.mapping.replaceAll('*', '') : exprDir;
    const filePath = url.pathname.replace(exprDir, mappingDir);
    const fileFullPath = path.join(config.path, filePath);
    if (['html', 'htm', 'txt', 'md'].indexOf(ext) !== -1) {
      if (fs.existsSync(fileFullPath)) {
        const content = fs.readFileSync(fileFullPath, 'utf8');
        ctx.body = content;
      } else {
        ctx.status = 400;
        await next();
      }
    } else if (ext === 'js') {
      if (fs.existsSync(fileFullPath)) {
        const fn = require(fileFullPath);
        await fn(ctx);
        await next();
      } else {
        ctx.status = 400;
        await next();
      }
    } else if (ext === '') {
      const fileFullPathWithExt = lastPiece ? fileFullPath + '.js' : fileFullPath + 'Application.ts';
      if (fs.existsSync(fileFullPathWithExt)) {
        const fn = require(fileFullPathWithExt);
        await fn(ctx);
        await next();
      } else {
        ctx.status = 400;
        await next();
      }
    } else {
      ctx.body = 'unsupported request';
      await next();
    }
  } else {
    await next();
  }
};

export const DynamicRoutes = {
  /**
   * 加载动态路由
   * @param app
   * @param server
   * @param config
   * @param enabled
   */
  init: function (app, server, config = { routes: [] }, enabled = true) {
    if (enabled) {
      const { routes } = config;
      const root = server.$root;
      root.routes = routes ? routes : [];
      server.use(_parser);
    }
  }
};