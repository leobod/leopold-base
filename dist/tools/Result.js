"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Result = void 0;
exports.Result = {
    ResponseType: {
        code: 200,
        msg: '',
        data: null
    },
    STATUS_CODE: {
        SUCCESS: 200,
        PAGE_NOTFOUND: 404,
        UNKNOWN_ERROR: 500,
        PARAM_ERROR: 10001,
        USER_ACCOUNT_ERROR: 20001,
        USER_LOGIN_ERROR: 30001,
        BUSINESS_ERROR: 40001,
        AUTH_ERROR: 50001 // 认证失败或TOKEN过期
    },
    success(data, msg = '', code = exports.Result.STATUS_CODE.SUCCESS) {
        return {
            code,
            msg,
            data
        };
    },
    fail(data, msg = '', code = exports.Result.STATUS_CODE.UNKNOWN_ERROR) {
        return {
            code,
            msg,
            data
        };
    }
};
