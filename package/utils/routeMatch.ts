import pathMatch from 'path-match'

// 示例用法
// const prefix = '/api';
// const regex = routePrefixToRegex(prefix);
// console.log(regex); // 输出 /^\/api/

const routePrefixToRegex = function (prefix) {
  // 对于特殊字符进行转义，例如：'/' -> '\/'
  const escapedPrefix = prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  // 构建正则表达式
  const regexStr = `^${escapedPrefix}`
  // 返回对应的正则表达式对象
  return new RegExp(regexStr)
}

const routePrefixMather = function (match) {
  const matcher = pathMatch({
    // path-to-regexp options
    sensitive: false,
    strict: true,
    end: false
  })(match)
  return matcher
}

export { routePrefixToRegex, routePrefixMather }
