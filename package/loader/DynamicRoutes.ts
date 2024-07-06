import p from 'path'
import { globSync } from 'glob'
import { routePrefixMather } from '../utils/routeMatch'

interface DynamicRoutesConfig {
  opts: Array<{ match: string; dir: string }>
}

interface DynamicRoutesFn {
  (ctx: any): void
}

const getRenderFilePath = async (
  root,
  app,
  config: DynamicRoutesConfig = { opts: [] }
) => {
  const { opts } = config
  const routeList = opts ? opts : []
  let routeFileList: Array<any> = []
  for (const item of routeList) {
    const currentDir = p.join(process.cwd(), item.dir)
    const fileList = globSync(['**/*.js'], {
      ignore: 'node_modules/**',
      cwd: currentDir,
      absolute: false
    })
    const fileListPost: Object = {}
    for (const fileItem of fileList) {
      const fileItemPath = fileItem
        .replace(/]/g, '')
        .replace(/\[/g, ':')
        .replace(/\\/g, '/')
        .replace(/.js/g, '')
      let matchedKey = ''
      const originFilePath = p.join(process.cwd(), item.dir, fileItem)
      const fn = require(decodeURIComponent(originFilePath))
      if (typeof fn === 'function') {
        if (fileItemPath.endsWith('index')) {
          const indexFilePath = fileItemPath.slice(0, fileItemPath.length - 5)
          matchedKey = `${item.match === '/' ? '' : item.match}${indexFilePath}`
          fileListPost[matchedKey] = fn
          matchedKey = `${item.match === '/' ? '' : item.match}${fileItemPath}`
          fileListPost[matchedKey] = fn
        } else {
          matchedKey = `${item.match === '/' ? '' : item.match}${fileItemPath}`
          fileListPost[matchedKey] = fn
        }
      } else if (typeof fn === 'object') {
        for (const fnKey in fn) {
          const fnVal = fn[fnKey]
          if (typeof fnVal === 'function') {
            if (fnKey.endsWith('index')) {
              matchedKey = `${item.match === '/' ? '' : item.match}${fileItemPath}/`
              fileListPost[matchedKey] = fnVal
              matchedKey = `${item.match === '/' ? '' : item.match}${fileItemPath}/${fnKey}`
              fileListPost[matchedKey] = fnVal
            } else {
              matchedKey = `${item.match === '/' ? '' : item.match}${fileItemPath}/${fnKey}`
              fileListPost[matchedKey] = fnVal
            }
          }
        }
      }
    }
    routeFileList.push({
      match: routePrefixMather(item.match),
      regPath: item.match,
      isLeaf: false,
      children: fileListPost
    })
  }
  root.routes = routeFileList
}

const renderMatch = async (ctx, next) => {
  const parsedUrl = new URL(ctx.href)
  const leopold = ctx.leopold
  let fn: null | DynamicRoutesFn = null
  for (const group of leopold.routes) {
    if (group.match(parsedUrl.pathname)) {
      fn = group.children[parsedUrl.pathname]
      break
    }
  }
  if (fn) {
    await fn(ctx)
  } else {
    await next()
  }
}

export const DynamicRoutes = {
  /**
   * 加载动态路由
   * @param root
   * @param app
   * @param config
   */
  onLoad: async function (root, app, config: DynamicRoutesConfig = { opts: [] }) {
    await getRenderFilePath(root, app, config)
    app.use(renderMatch)
  }
}
