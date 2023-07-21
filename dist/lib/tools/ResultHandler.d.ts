interface ResponseType {
    code: number;
    msg: string;
    data: any;
}
declare class ResultHandler {
    static STATUS_CODE: {
        SUCCESS: number;
        PARAM_ERROR: number;
        USER_ACCOUNT_ERROR: number;
        USER_LOGIN_ERROR: number;
        BUSINESS_ERROR: number;
        AUTH_ERROR: number;
        UNKNOWN_ERROR: number;
    };
    static success(data: any, msg?: string, code?: number): ResponseType;
    static fail(data: any, msg?: string, code?: number): ResponseType;
}
export { ResponseType, ResultHandler };
