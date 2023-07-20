interface ResponseType {
  code: number;
  msg: string;
  data: any;
}

class ResultHandler {
  static STATUS_CODE = {
    SUCCESS: 200, // 成功
    PARAM_ERROR: 10001, // 参数错误
    USER_ACCOUNT_ERROR: 20001, // 账号或密码错误
    USER_LOGIN_ERROR: 30001, // 用户未登录
    BUSINESS_ERROR: 40001, // 业务请求失败
    AUTH_ERROR: 50001, // 认证失败或TOKEN过期
    UNKNOWN_ERROR: 60001 // 未知错误
  };
  static success(data, msg = '', code = ResultHandler.STATUS_CODE.SUCCESS): ResponseType {
    return {
      code,
      msg,
      data
    };
  }

  static fail(data, msg = '', code = ResultHandler.STATUS_CODE.UNKNOWN_ERROR): ResponseType {
    return {
      code,
      msg,
      data
    };
  }
}

export { ResponseType, ResultHandler };
