import { routePrefixMather } from '../utils/routeMatch'

const compress = require('koa-compress')

interface CompressConfig {
  match?: string
  opts?: Object
}

export const Compress = {
  /**
   * 加载Compress
   * @param root
   * @param app
   * @param config
   */
  onLoad: function (root, app, config: CompressConfig = {}) {
    const { match = '/', opts = {} } = config
    const matcher = routePrefixMather(match)
    const finalOpts = Object.assign({}, opts)
    app.use(async (ctx, next) => {
      if (matcher(ctx.url)) {
        await compress(finalOpts)(ctx, next)
      } else {
        await next()
      }
    })
  }
}
