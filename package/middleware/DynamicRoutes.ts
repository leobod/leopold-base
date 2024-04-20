import p from 'path';
import fs from 'fs';
import pathMatch from 'path-match';
import { globSync } from 'glob';

interface DynamicRoutesConfigDef {
  routes: Array<{ dir: string; mapping: string }>;
}

const route = pathMatch();

const getRenderFilePath = async (app, server, config: DynamicRoutesConfigDef = { routes: [] }) => {
  const { routes } = config;
  const routeList = routes ? routes : [];
  let routeFileList: Array<any> = [];
  for (const item of routeList) {
    const currentDir = p.join(process.cwd(), item.dir);
    const fileList = globSync(['**/*.js'], {
      ignore: 'node_modules/**',
      cwd: currentDir,
      absolute: false
    });
    const fileListPost: Array<any> = [];
    for (const fileItem of fileList) {
      const fileItemPath = fileItem.replace(/]/g, '').replace(/\[/g, ':').replace(/\\/g, '/').replace(/.js/g, '');
      if (fileItemPath.endsWith('index')) {
        const indexFilePath = fileItemPath.slice(0, fileItemPath.length - 5);
        fileListPost.push({
          regPath: `${item.mapping === '/' ? '' : item.mapping}/${indexFilePath}`,
          originPath: p.join(process.cwd(), item.dir, fileItem)
        });
      }
      fileListPost.push({
        regPath: `${item.mapping === '/' ? '' : item.mapping}/${fileItemPath}`,
        originPath: p.join(process.cwd(), item.dir, fileItem)
      });
    }
    routeFileList = [...routeFileList, ...fileListPost];
  }
  app.routes = routeFileList
    .map((item) => {
      return {
        match: route(item.regPath),
        regPath: item.regPath,
        originPath: item.originPath,
        fn: require(decodeURIComponent(item.originPath))
      };
    })
    .reverse();
};

const renderMatch = async (ctx, next) => {
  const leopold = ctx.leopold;
  let matched = null;
  for (const r of leopold.routes) {
    const url = new URL('http://localhost' + ctx.url);
    matched = r.match(url.pathname);
    if (matched) {
      ctx.status = 200;
      ctx.matched = matched;
      await r.fn(ctx);
      await next();
      break;
    }
  }
  if (!matched) {
    await next();
  }
};

export const DynamicRoutes = {
  /**
   * 加载动态路由
   * @param leopold
   * @param app
   * @param config
   * @param enabled
   */
  init: function (leopold, app, config = { routes: [] }, enabled = true) {
    if (enabled) {
      getRenderFilePath(leopold, app, config);
      app.use(renderMatch);
    }
  }
};
