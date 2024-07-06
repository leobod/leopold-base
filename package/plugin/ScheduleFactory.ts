import schedule from 'node-schedule'

/*
*    *    *    *    *    *
┬    ┬    ┬    ┬    ┬    ┬
│    │    │    │    │    │
│    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
│    │    │    │    └───── month (1 - 12)
│    │    │    └────────── day of month (1 - 31)
│    │    └─────────────── hour (0 - 23)
│    └──────────────────── minute (0 - 59)
└───────────────────────── second (0 - 59, OPTIONAL)
*/
// Execute a cron job every 5 Minutes = */5 * * * *

/*
// Execute a cron job when the minute is 42
const job = schedule.scheduleJob('42 * * * *', function(){
  console.log('The answer to life, the universe, and everything!');
});

const rule = new schedule.RecurrenceRule();
rule.dayOfWeek = [0, new schedule.Range(4, 6)];
rule.hour = 17;
rule.minute = 0;

const job = schedule.scheduleJob(rule, function(){
  console.log('Today is recognized by Rebecca Black!');
});

const job = schedule.scheduleJob({hour: 14, minute: 30, dayOfWeek: 0}, function(){
  console.log('Time for tea!');
});
*/

/*
schedule.scheduleJob("任务id", rule, () => {})
schedule.scheduleJob("任务id", date, () => {})
// job.cancel(reschedule)
// When you set the parameter reschedule to true then the Job is newly scheduled afterwards.
// job.nextInvocation()
// This method returns a Date object for the planned next Invocation for this Job
schedule.scheduledJobs["任务id"].cancel();
// 删除所有任务
for (let i in schedule.scheduledJobs) {
    schedule.cancelJob(i);
}

// gracefulShutdown() will cancel all jobs and return Promise.
schedule.gracefulShutdown();
 */

export class ScheduleManager {
  public list: any = {}

  constructor() {}

  /**
   * 创建job
   * @param name
   * @param rule
   * @param method
   */
  createJob(name, rule, method) {
    if (this.list[name]) {
      this.list[name].cancel()
    }
    this.list[name] = schedule.scheduleJob(name, rule, method)
    return this.list[name]
  }
  /**
   * 停止指定Job
   * @param name
   */
  stopJob(name) {
    if (this.list[name]) {
      this.list[name].cancel()
      return true
    }
    return false
  }
}

class ScheduleFactory {
  public static instance: ScheduleManager | null = null

  public static onCreate = function (config = {}) {
    const instance: ScheduleManager = new ScheduleManager()
    ScheduleFactory.instance = instance
    return instance
  }
}

export { ScheduleFactory }
