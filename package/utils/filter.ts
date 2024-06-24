/**
 * 使用model过滤结果集
 * @param dbResult
 * @param filter
 * @returns {*}
 */
const filterDbResult = (dbResult, filter) => {
  if (dbResult) {
    return dbResult.map((item) => {
      for (const key in filter) {
        const filterFn = filter[key];
        if (item[key] !== undefined && item[key] !== null) {
          item[key] = filterFn(item[key], item) || item[key];
        }
      }
      return item;
    });
  } else {
    return [];
  }
};

/**
 * 过滤对象中的null属性
 * @param obj
 * @returns {{}}
 */
const filterNullProps = (obj) => {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (value !== null) {
      acc[key] = value;
    }
    return acc;
  }, {});
};

export { filterDbResult, filterNullProps };
