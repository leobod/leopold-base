/**
 * 下划线转帕斯卡
 * @param val
 */
export function toPascalCase(name: any): any;
/**
 * 下划线转驼峰
 * @param name
 */
export function toCamelCase(name: any): any;
/**
 * 驼峰转换下划线
 * @param name
 */
export function toKebabCase(name: any, isPascalCase?: boolean): any;
/**
 * 匈牙利命名
 * @param val
const toHungarian = function (val) {

}
 */
/** 返回数据下划线转化为驼峰命名
 * @param {data} 'obj或ary'
 * @param {type} 'Camel' 为下划线转驼峰，'Kebab' 为驼峰转下划线
 * @return {Array||Object}
 */
export function formatObjCase(data: any, type?: string): any[];
