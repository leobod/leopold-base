import { WebsocketFactory } from '../plugin/WebsocketFactory'

export const Websocket = {
  /**
   * 加载Websocket
   * @param root
   * @param app
   * @param config
   */
  onLoad: function (root, app, config = {}) {
    root.wss = WebsocketFactory.onCreate(root.server)
    app.use(async (ctx, next) => {
      ctx.wss = root.wss
      await next()
    })
  }
}
