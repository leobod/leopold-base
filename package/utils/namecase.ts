/**
 * 下划线转帕斯卡
 * @param val
 */
const toPascalCase = function (val) {
  const camelCaseName = toCamelCase(val);
  return camelCaseName.slice(0, 1).toUpperCase() + camelCaseName.slice(1);
};

/**
 * 下划线转驼峰
 * @param val
 */
const toCamelCase = (val) => {
  return val.replace(/_[a-z]/g, function (s) {
    return s.substring(1).toUpperCase();
  });
};

/**
 * 驼峰转换下划线
 * @param val
 */
const toLineCase = (val) => {
  return val.replace(/([A-Z])/g, '_$1').toLowerCase();
};

const formatKeyCase = (key, type = 'Line2Camel') => {
  if (type === 'Line2Camel') {
    return toCamelCase(key);
  } else if (type === 'Camel2Line') {
    return toLineCase(key);
  } else {
    return key;
  }
};

const reverseFormatKeyCase = (key, type = 'Line2Camel') => {
  if (type === 'Line2Camel') {
    // 驼峰转下划线 做为 下划线转驼峰的反义
    return toLineCase(key);
  } else if (type === 'Camel2Line') {
    // 下划线转驼峰 做为 驼峰转下划线的反义
    return toCamelCase(key);
  } else {
    return key;
  }
};

/** 返回数据下划线转化为驼峰命名
 * @param data 'obj或ary'
 * @param type 'Camel' 为下划线转驼峰，'Kebab' 为驼峰转下划线
 * @return {Array||Object}
 */
const formatObjCase = (data, type = 'Line2Camel') => {
  // 判断传入的值是对象还是数组
  const newData =
    Object.prototype.toString.call(data) === '[object Object]'
      ? [JSON.parse(JSON.stringify(data))]
      : JSON.parse(JSON.stringify(data));

  function toggleFn(list) {
    list.forEach((item) => {
      for (const key in item) {
        let newKey = key;
        if (type === 'Line2Camel') {
          // 下划线 转 驼峰
          newKey = toCamelCase(key);
        }
        if (type === 'Camel2Line') {
          // 驼峰 转 下划线
          newKey = toLineCase(key);
        }
        const newValue = item[key];
        delete item[key];
        item[newKey] = newValue;
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
  } else {
    return newData;
  }
};

const reverseFormatObjCase = (data, type = 'Line2Camel') => {
  // 判断传入的值是对象还是数组
  const newData =
    Object.prototype.toString.call(data) === '[object Object]'
      ? [JSON.parse(JSON.stringify(data))]
      : JSON.parse(JSON.stringify(data));

  function toggleFn(list) {
    list.forEach((item) => {
      for (const key in item) {
        let newKey = key;
        if (type === 'Camel2Line') {
          // 下划线转驼峰 做为 驼峰转下划线的反义
          newKey = toCamelCase(key);
        }
        if (type === 'Line2Camel') {
          // 驼峰转下划线 做为 下划线转驼峰的反义
          newKey = toLineCase(key);
        }
        const newValue = item[key];
        delete item[key];
        item[newKey] = newValue;
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
  } else {
    return newData;
  }
};

export {
  toPascalCase,
  toCamelCase,
  toLineCase,
  formatObjCase,
  reverseFormatObjCase,
  formatKeyCase,
  reverseFormatKeyCase
};
