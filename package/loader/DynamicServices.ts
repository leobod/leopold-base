import p from 'path'
import { globSync } from 'glob'

interface DynamicServicesConfig {
  opts: Array<{ dir: string }>
}

const getServicesFilePath = (root, app, config: DynamicServicesConfig = { opts: [] }) => {
  const { opts } = config
  const servicesList = opts ? opts : []
  for (const item of servicesList) {
    const currentDir = p.join(process.cwd(), item.dir)
    const fileList = globSync(['**/*.js'], {
      ignore: 'node_modules/**',
      cwd: currentDir,
      absolute: false
    })
    for (const fileItem of fileList) {
      const originFilePath = p.join(process.cwd(), item.dir, fileItem)
      const fn = require(decodeURIComponent(originFilePath))
      if (typeof fn === 'function') {
        root.service.set(fn.name, new fn())
      }
    }
  }
}

export const DynamicServices = {
  /**
   * 加载动态路由
   * @param root
   * @param app
   * @param config
   */
  onLoad: function (root, app, config: DynamicServicesConfig = { opts: [] }) {
    root.service = new Map()
    getServicesFilePath(root, app, config)
    app.use(async (ctx, next) => {
      ctx.service = root.service
      await next()
    })
  }
}
