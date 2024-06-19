export interface UniResponseResultType {
  code: number;
  msg: string;
  data: any;
}

export interface UniResponseType {
  (data: any, msg?: string, code?: number): UniResponseResultType;
}

const uniResponse: UniResponseType = function (
  data: any,
  msg: string = 'success',
  code: number = 0
) {
  return {
    code,
    msg,
    data
  };
};

export const Result = {
  /**
   * 加载Result
   * @param root
   * @param app
   * @param config
   */
  onLoad: function (root, app, config = {}) {
    root.result = uniResponse;
    app.use(async (ctx, next) => {
      ctx.result = uniResponse;
      await next();
    });
  }
};
