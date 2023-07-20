const Mock = require('mockjs')

const mock = (option) => {
  return Mock.mock(option)
}

/**
 * mock模拟接口
 * @param {Array | Object} option mock数据格式
 * @returns {Promise} 接口数据
 */
const mockDataList = (option) => {
  return {
    errorCode: 0,
    message: '操作成功',
    resData: {
      dataList: Mock.mock(option),
      recordCount: 36,
      totalPage: 2
    }
  }
}

module.exports = {
  mock,
  mockDataList
}
