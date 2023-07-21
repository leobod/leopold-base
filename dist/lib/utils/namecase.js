/**
 * 下划线转帕斯卡
 * @param val
 */
const toPascalCase = function (name) {
    const camelCaseName = toCamelCase(name);
    const pascalCaseName = camelCaseName.slice(0, 1).toUpperCase() + camelCaseName.slice(1);
    return pascalCaseName;
};
/**
 * 下划线转驼峰
 * @param name
 */
const toCamelCase = function (name) {
    return name.replace(/\_(\w)/g, function (all, letter) {
        return letter.toUpperCase();
    });
};
/**
 * 驼峰转换下划线
 * @param name
 */
const toKebabCase = function (name, isPascalCase = false) {
    if (isPascalCase) {
        const kebabCase = name.replace(/([A-Z])/g, '_$1').toLowerCase();
        return kebabCase.slice(1);
    }
    else {
        return name.replace(/([A-Z])/g, '_$1').toLowerCase();
    }
};
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
const formatObjCase = (data, type = 'Camel') => {
    // 判断传入的值是对象还是数组
    const newData = Object.prototype.toString.call(data) === '[object Object]'
        ? [JSON.parse(JSON.stringify(data))]
        : JSON.parse(JSON.stringify(data));
    function toggleFn(list) {
        list.forEach((item) => {
            for (const key in item) {
                // 下划线 转 驼峰
                if (type === 'Camel') {
                    const keyIndex = key.indexOf('_');
                    // 如果等于0，说明在key最前面有_，此时直接去掉即可
                    if (keyIndex === 0) {
                        const newKey = key.split('');
                        const newValue = item[key];
                        newKey.splice(keyIndex, 1);
                        delete item[key];
                        item[newKey.join('')] = newValue;
                    }
                    if (keyIndex !== -1 && keyIndex !== 0) {
                        const letter = key[keyIndex + 1].toUpperCase();
                        const newKey = key.split('');
                        const newValue = item[key];
                        newKey.splice(keyIndex, 2, letter);
                        delete item[key];
                        item[newKey.join('')] = newValue;
                    }
                }
                // 驼峰 转 下划线
                if (type === 'Kebab') {
                    const regexp = /^[A-Z]+$/;
                    const newKey = key.split('');
                    const newValue = item[key];
                    newKey.forEach((item2, index2) => {
                        if (regexp.test(item2)) {
                            newKey[index2] = '_' + item2.toLowerCase();
                        }
                    });
                    delete item[key];
                    item[newKey.join('')] = newValue;
                }
                // 如果值为对象
                if (Object.prototype.toString.call(item[key]) === '[object Object]') {
                    toggleFn([item[key]]);
                }
                // 如果值为数组
                if (Object.prototype.toString.call(item[key]) === '[object Array]') {
                    toggleFn(item[key]);
                }
            }
        });
    }
    toggleFn(newData);
    // 因为上面操作未来方便操作，会将对象转化为数组格式，操作完后，需要将原先是对象的重新转化为对象
    if (Object.prototype.toString.call(data) === '[object Object]') {
        let obj = null;
        newData.forEach((item) => (obj = item));
        return obj;
    }
    else {
        return newData;
    }
};
module.exports = { toPascalCase, toCamelCase, toKebabCase, formatObjCase };
