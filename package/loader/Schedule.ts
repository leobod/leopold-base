import { ScheduleFactory } from '../plugin/ScheduleFactory'

export const Schedule = {
  /**
   * 加载Schedule
   * @param root
   * @param app
   * @param config
   */
  onLoad: function (root, app, config = {}) {
    root.schedule = ScheduleFactory.onCreate(config)
    app.use(async (ctx, next) => {
      ctx.schedule = root.schedule
      await next()
    })
  }
}
