import dayjs from 'dayjs'
dayjs.locale('zh-cn')

type DateInputType = Date | string

/**
 * 日期格式化
 * @param d
 * @param format  YYYY/MM/DD HH:mm:ss
 */
const formatDate = (d: DateInputType, format: string) => {
  return dayjs(d).format(format)
}

const toDate = (d: DateInputType) => {
  return dayjs(d).toDate()
}

const getStartOfHour = (d: DateInputType, h = 'HH') => formatDate(d, `YYYY/MM/DD ${h}:00:00`)
const getStartOfDay = (d: DateInputType) => formatDate(d, 'YYYY/MM/DD 00:00:00')
const getEndOfDay = (d: DateInputType) => formatDate(d, 'YYYY/MM/DD 23:59:59')
const getStartOfWeek = (d: DateInputType) => {
  const date = toDate(d)
  const r = toDate(d)
  if (date.getDay() === 0) {
    r.setDate(date.getDate() - 6)
  } else {
    r.setDate(date.getDate() - (date.getDay() - 1))
  }
  return getStartOfDay(r)
}
const getEndOfWeek = (d: DateInputType) => {
  const date = toDate(d)
  const r = toDate(d)
  if (date.getDay() === 0) {
    r.setDate(date.getDate())
  } else {
    r.setDate(date.getDate() + (7 - date.getDay()))
  }
  return getEndOfDay(r)
}
const getStartOfMonth = (d: DateInputType) => formatDate(d, 'YYYY/MM/01 00:00:00')

const getMaxDateOfMonth = (d: DateInputType) => {
  const date = toDate(d)
  date.setDate(1)
  date.setMonth(date.getMonth() + 1)
  date.setDate(0)
  return date.getDate()
}

const getEndOfMonth = (d: DateInputType) => {
  const lastDate = getMaxDateOfMonth(d)
  return formatDate(d, `YYYY/MM/${lastDate} 23:59:59`)
}

const getCloserDateTime = (d: DateInputType, interval = 15, step = 0, type = 'ceil') => {
  const date = toDate(d)
  let numberInterval
  if (type === 'ceil') {
    /* 取上整 */
    numberInterval = Math.ceil(date.getMinutes() / interval)
  } else if (type === 'floor') {
    /* 取下整 */
    numberInterval = Math.floor(date.getMinutes() / interval)
  } else if (type === 'round') {
    /* 四舍五入 */
    numberInterval = Math.floor(date.getMinutes() / interval)
  } else {
    numberInterval = Math.ceil(date.getMinutes() / interval)
  }
  date.setHours(date.getHours(), (numberInterval + step) * interval, 0, 0)
  return date
}

/**
 * 是否是今天
 * @param d
 * @returns {number} 返回2明天之后，返回1今天，返回0昨天之前
 */
const getIsToday = (d: DateInputType) => {
  const date = toDate(d)
  const now = new Date()
  let result = 0

  if (date.getFullYear() > now.getFullYear()) {
    result = 2
  } else if (date.getFullYear() < now.getFullYear()) {
    result = 0
  } else {
    if (date.getMonth() > now.getMonth()) {
      result = 2
    } else if (date.getMonth() < now.getMonth()) {
      result = 0
    } else {
      if (date.getDate() > now.getDate()) {
        result = 2
      } else if (date.getDate() < now.getDate()) {
        result = 0
      } else {
        result = 1
      }
    }
  }
  return result
}

export {
  formatDate,
  toDate,
  getStartOfHour,
  getEndOfWeek,
  getStartOfMonth,
  getMaxDateOfMonth,
  getEndOfMonth,
  getCloserDateTime,
  getIsToday
}
