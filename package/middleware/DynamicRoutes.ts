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
    const fileListPost: Object = {};
    for (const fileItem of fileList) {
      const fileItemPath = fileItem
        .replace(/]/g, '')
        .replace(/\[/g, ':')
        .replace(/\\/g, '/')
        .replace(/.js/g, '');
      let matchedKey = ''
      if (fileItemPath.endsWith('index')) {
        const indexFilePath = fileItemPath.slice(0, fileItemPath.length - 5);
        matchedKey = `${item.match === '/' ? '' : item.match}${indexFilePath}`
        const originFilePath = p.join(process.cwd(), item.dir, fileItem)
        const fn = require(decodeURIComponent(originFilePath));
        fileListPost[matchedKey] = fn
        matchedKey = `${item.match === '/' ? '' : item.match}${fileItemPath}`
        fileListPost[matchedKey] = fn
      } else {
        matchedKey = `${item.match === '/' ? '' : item.match}${fileItemPath}`
        const originFilePath = p.join(process.cwd(), item.dir, fileItem)
        const fn = require(decodeURIComponent(originFilePath));
        fileListPost[matchedKey] = fn
      }
    }
    routeFileList.push({
      match: routePrefixMather(item.match),
      regPath: item.match,
      isLeaf: false,
      children: fileListPost
    });

  }
  app.routes = routeFileList;
};

const renderMatch = async (ctx, next) => {
  const parsedUrl = new URL(ctx.href);
  const leopold = ctx.leopold;
  for (const group of leopold.routes) {
    if (group.match(parsedUrl.pathname)) {
      const fn = group.children[parsedUrl.pathname]
      if (fn) {
        ctx.status = 200;
        await fn(ctx);
        break;
      } else {
        ctx.status = 404
        break;
      }
    }
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
