const Result = {
  ResponseType: {
    code: 200,
    msg: '',
    data: null
  },
  STATUS_CODE: {
    SUCCESS: 200, // 成功
    PAGE_NOTFOUND: 404,
    UNKNOWN_ERROR: 500, // 未知错误
    PARAM_ERROR: 10001, // 参数错误
    USER_ACCOUNT_ERROR: 20001, // 账号或密码错误
    USER_LOGIN_ERROR: 30001, // 用户未登录
    BUSINESS_ERROR: 40001, // 业务请求失败
    AUTH_ERROR: 50001, // 认证失败或TOKEN过期
  },
  success(data, msg = '', code = Result.STATUS_CODE.SUCCESS) {
    return {
      code,
      msg,
      data
    };
  },
  fail(data, msg = '', code = Result.STATUS_CODE.UNKNOWN_ERROR) {
    return {
      code,
      msg,
      data
    };
  }
};

module.exports = { Result };
