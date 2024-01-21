type ResponseDef = {
  code: number;
  msg: string;
  data: any;
};

const Result = {
  STATUS_CODE: {
    SUCCESS: {
      errCode: 0,
      msg: 'SUCCESS',
      msgZh: '操作成功'
    },
    UNKNOWN_ERROR: {
      errCode: 101,
      msg: 'UNKNOWN_ERROR',
      msgZh: '未知异常'
    },
    PARAM_ERROR: {
      errCode: 102,
      msg: 'PARAM_ERROR',
      msgZh: '参数错误'
    },
    ACCOUNT_PASSWD_ERROR: {
      errCode: 103,
      msg: 'ACCOUNT_PASSWD_ERROR',
      msgZh: '账号或密码错误'
    },
    AUTH_ERROR: {
      errCode: 104,
      msg: 'AUTH_ERROR',
      msgZh: '认证失败或TOKEN过期'
    }
  },
  success(data: any, msg: string = Result.STATUS_CODE.SUCCESS.msg, code: number = Result.STATUS_CODE.SUCCESS.errCode): ResponseDef {
    return {
      code,
      msg,
      data
    };
  },

  fail(data: any, msg: string = Result.STATUS_CODE.UNKNOWN_ERROR.msg, code: number = Result.STATUS_CODE.UNKNOWN_ERROR.errCode): ResponseDef {
    return {
      code,
      msg,
      data
    };
  }
};

export { Result };
