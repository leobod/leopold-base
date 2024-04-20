class ResultManager {
  public UNKNOWN_ERROR = {
    errCode: -1,
    msg: 'UNKNOWN_ERROR',
    msgZh: '未知异常'
  };
  public SUCCESS = {
    errCode: 0,
    msg: 'SUCCESS',
    msgZh: '操作成功'
  };
  public AUTH_ERROR = {
    errCode: 10001,
    msg: 'AUTH_ERROR',
    msgZh: '认证失败'
  };
  public PARAM_ERROR = {
    errCode: 10002,
    msg: 'PARAM_ERROR',
    msgZh: '参数错误'
  };

  constructor() {}

  setStatusCode(key, value) {
    this[key] = value;
  }

  getStatusCode(key) {
    return this[key] || null;
  }

  success(data: any, msg: string = this.SUCCESS.msg, code: number = this.SUCCESS.errCode) {
    return {
      code,
      msg,
      data
    };
  }

  fail(data: any, msg: string = this.UNKNOWN_ERROR.msg, code: number = this.UNKNOWN_ERROR.errCode) {
    return {
      code,
      msg,
      data
    };
  }
}

class Result {
  public static instance: ResultManager | null = null;

  public static onCreate(config = {}) {
    const resultManager = new ResultManager();
    for (const key in config) {
      resultManager.setStatusCode(key, config[key]);
    }
    Result.instance = resultManager;
    return resultManager;
  }
}

const useResult = function () {
  return Result.instance;
};

export { Result, useResult };
