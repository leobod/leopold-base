import p from 'path';
import { globSync } from 'glob';
import { routePrefixMather } from '../utils/routeMatch';

interface DynamicRoutesConfig {
  opts: Array<{ match: string; dir: string }>;
}

const getRenderFilePath = async (
  app,
  server,
  config: DynamicRoutesConfig = { opts: [] }
) => {
  const { opts } = config;
  const routeList = opts ? opts : [];
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
      const fileItemPath = fileItem
        .replace(/]/g, '')
        .replace(/\[/g, ':')
        .replace(/\\/g, '/')
        .replace(/.js/g, '');
      if (fileItemPath.endsWith('index')) {
        const indexFilePath = fileItemPath.slice(0, fileItemPath.length - 5);
        fileListPost.push({
          isLeaf: true,
          regPath: `${item.match === '/' ? '' : item.match}${indexFilePath}`,
          originPath: p.join(process.cwd(), item.dir, fileItem)
        });
      }
      fileListPost.push({
        isLeaf: true,
        regPath: `${item.match === '/' ? '' : item.match}${fileItemPath}`,
        originPath: p.join(process.cwd(), item.dir, fileItem)
      });
    }
    routeFileList.push({
      match: routePrefixMather(item.match),
      regPath: item.match,
      isLeaf: false,
      children: fileListPost
        .map((item) => {
          item.match = routePrefixMather(item.regPath);
          item.fn = require(decodeURIComponent(item.originPath));
          return item;
        })
        .reverse()
    });
  }
  app.routes = routeFileList;
};

const renderMatch = async (ctx, next) => {
  const leopold = ctx.leopold;
  let matched = null;
  for (const group of leopold.routes) {
    if (group.match(ctx.url)) {
      for (const item of group.children) {
        matched = item.match(ctx.url);
        if (matched) {
          ctx.status = 200;
          ctx.matched = matched;
          await item.fn(ctx);
          // await next();
          break;
        }
      }
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
   */
  onLoad: function (leopold, app, config: DynamicRoutesConfig = { opts: [] }) {
    getRenderFilePath(leopold, app, config);
    app.use(renderMatch);
  }
};
