"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIsToday = exports.getCloserDateTime = exports.getEndOfMonth = exports.getMaxDateOfMonth = exports.getStartOfMonth = exports.getEndOfWeek = exports.getStartOfHour = exports.toDate = exports.formatDate = void 0;
const dayjs = require('dayjs');
/**
 * 日期格式化
 * @param d
 * @param format  YYYY/MM/DD HH:mm:ss
 */
const formatDate = (d, f) => {
    return dayjs(d).format(f);
};
exports.formatDate = formatDate;
/**
 * 日期格式处理
 * @param d
 * @returns {*}
 */
const toDate = (d) => {
    return dayjs(d).toDate();
};
exports.toDate = toDate;
const getStartOfHour = (d, h = 'HH') => formatDate(d, `YYYY/MM/DD ${h}:00:00`);
exports.getStartOfHour = getStartOfHour;
const getStartOfDay = (d) => formatDate(d, 'YYYY/MM/DD 00:00:00');
const getEndOfDay = (d) => formatDate(d, 'YYYY/MM/DD 23:59:59');
const getStartOfWeek = (d) => {
    const date = toDate(d);
    const r = toDate(d);
    if (date.getDay() === 0) {
        r.setDate(date.getDate() - 6);
    }
    else {
        r.setDate(date.getDate() - (date.getDay() - 1));
    }
    return getStartOfDay(r);
};
const getEndOfWeek = (d) => {
    const date = toDate(d);
    const r = toDate(d);
    if (date.getDay() === 0) {
        r.setDate(date.getDate());
    }
    else {
        r.setDate(date.getDate() + (7 - date.getDay()));
    }
    return getEndOfDay(r);
};
exports.getEndOfWeek = getEndOfWeek;
const getStartOfMonth = (d) => formatDate(d, 'YYYY/MM/01 00:00:00');
exports.getStartOfMonth = getStartOfMonth;
const getMaxDateOfMonth = (d) => {
    const date = toDate(d);
    date.setDate(1);
    date.setMonth(date.getMonth() + 1);
    date.setDate(0);
    return date.getDate();
};
exports.getMaxDateOfMonth = getMaxDateOfMonth;
const getEndOfMonth = (d) => {
    const lastDate = getMaxDateOfMonth(d);
    return formatDate(d, `YYYY/MM/${lastDate} 23:59:59`);
};
exports.getEndOfMonth = getEndOfMonth;
const getCloserDateTime = (d, interval = 15, step = 0, type = 'ceil') => {
    const date = toDate(d);
    let numberInterval;
    if (type === 'ceil') {
        /* 取上整 */
        numberInterval = Math.ceil(date.getMinutes() / interval);
    }
    else if (type === 'floor') {
        /* 取下整 */
        numberInterval = Math.floor(date.getMinutes() / interval);
    }
    else if (type === 'round') {
        /* 四舍五入 */
        numberInterval = Math.floor(date.getMinutes() / interval);
    }
    else {
        numberInterval = Math.ceil(date.getMinutes() / interval);
    }
    date.setHours(date.getHours(), (numberInterval + step) * interval, 0, 0);
    return date;
};
exports.getCloserDateTime = getCloserDateTime;
/**
 * 是否是今天
 * @param d
 * @returns {number} 返回2明天之后，返回1今天，返回0昨天之前
 */
const getIsToday = (d) => {
    const date = toDate(d);
    const now = new Date();
    let result = 0;
    if (date.getFullYear() > now.getFullYear()) {
        result = 2;
    }
    else if (date.getFullYear() < now.getFullYear()) {
        result = 0;
    }
    else {
        if (date.getMonth() > now.getMonth()) {
            result = 2;
        }
        else if (date.getMonth() < now.getMonth()) {
            result = 0;
        }
        else {
            if (date.getDate() > now.getDate()) {
                result = 2;
            }
            else if (date.getDate() < now.getDate()) {
                result = 0;
            }
            else {
                result = 1;
            }
        }
    }
    return result;
};
exports.getIsToday = getIsToday;
