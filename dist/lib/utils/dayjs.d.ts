/**
 * 日期格式化
 * @param d
 * @param format  YYYY/MM/DD HH:mm:ss
 */
export function formatDate(d: any, format: any): string;
export function toDate(d: any): Date;
export function getStartOfHour(d: any, h?: string): string;
export function getEndOfWeek(d: any): string;
export function getStartOfMonth(d: any): string;
export function getMaxDateOfMonth(d: any): number;
export function getEndOfMonth(d: any): string;
export function getCloserDateTime(d: any, interval?: number, step?: number, type?: string): Date;
/**
 * 是否是今天
 * @param d
 * @returns {number} 返回2明天之后，返回1今天，返回0昨天之前
 */
export function getIsToday(d: any): number;
