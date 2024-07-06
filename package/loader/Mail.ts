import { MailFactory } from '../plugin/MailFactory'

export const Mail = {
  /**
   * 加载DB
   * @param root
   * @param app
   * @param config
   */
  onLoad: function (root, app, config = {}) {
    root.mail = MailFactory.onCreate(config)
    app.use(async (ctx, next) => {
      ctx.mail = root.mail
      await next()
    })
  }
}
