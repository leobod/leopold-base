/**
 * 日期格式化
 * @param d
 * @param format  YYYY/MM/DD HH:mm:ss
 */
declare const formatDate: (d: any, f: any) => any;
/**
 * 日期格式处理
 * @param d
 * @returns {*}
 */
declare const toDate: (d: any) => any;
declare const getStartOfHour: (d: any, h?: string) => any;
declare const getEndOfWeek: (d: any) => any;
declare const getStartOfMonth: (d: any) => any;
declare const getMaxDateOfMonth: (d: any) => any;
declare const getEndOfMonth: (d: any) => any;
declare const getCloserDateTime: (d: any, interval?: number, step?: number, type?: string) => any;
/**
 * 是否是今天
 * @param d
 * @returns {number} 返回2明天之后，返回1今天，返回0昨天之前
 */
declare const getIsToday: (d: any) => number;
export { formatDate, toDate, getStartOfHour, getEndOfWeek, getStartOfMonth, getMaxDateOfMonth, getEndOfMonth, getCloserDateTime, getIsToday };
