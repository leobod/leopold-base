"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResultHandler = void 0;
class ResultHandler {
    static success(data, msg = '', code = ResultHandler.STATUS_CODE.SUCCESS) {
        return {
            code,
            msg,
            data
        };
    }
    static fail(data, msg = '', code = ResultHandler.STATUS_CODE.UNKNOWN_ERROR) {
        return {
            code,
            msg,
            data
        };
    }
}
exports.ResultHandler = ResultHandler;
ResultHandler.STATUS_CODE = {
    SUCCESS: 200,
    PARAM_ERROR: 10001,
    USER_ACCOUNT_ERROR: 20001,
    USER_LOGIN_ERROR: 30001,
    BUSINESS_ERROR: 40001,
    AUTH_ERROR: 50001,
    UNKNOWN_ERROR: 60001 // 未知错误
};
