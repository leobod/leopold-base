<h1 align="center">leopold-base</h1>

## 项目介绍

> 本项目基于 koa 进行二次开发.

通过组合常用的koa插件，实现基于此项目可以快速的开发其他网络服务程序。
对于网络请求：设计中已匹配静态页面为优先，其次匹配动态网页渲染，最后是api服务，通过制定配置文件，根据发展需要，不断提供更多可供设计人员使用的工具与服务。

## 当前集成插件

+ [x] Cors跨域请求处理(简易版)
+ [x] 静态文件(基于koa-mount，koa-static，并提供有限的配置自定义)
+ [x] Log4j日志系统(简易版)
+ [x] 请求体处理(基于koa-body，并提供有限的配置自定义)
+ [x] 页面压缩
+ [x] 模板引擎(基于ejs)
+ [x] 动态路由自动注册(使用path-match定制)

## 提供的工具

+ [x] 统一返回结果处理
+ [x] 定时任务设置
+ [x] Redis的集成使用
+ [x] Mysql的集成使用
+ [x] 基于数据模型的数据库CURD

## 配置文件范例

```javascript
// app.config.js
const p = require('path');

module.exports = {
  path: '.',
  port: 8360,
  plugins: {
    Db: {
      // mysql: {
      //   type: 'MYSQL',
      //   config: {
      //     host: '42.192.233.200',
      //     port: '3306',
      //     database: '',
      //     user: '',
      //     password: '',
      //     encoding: 'utf8mb4',
      //     dateStrings: true,
      //     connectionLimit: 5 // 最大连接数
      //   }
      // },
      // redis: {
      //   type: 'REDIS',
      //   config: {
      //     host: '127.0.0.1',
      //     port: '6379',
      //     maxConnections: 5 // 最大连接数
      //   }
      // }
    },
    Result: {
      // UNKNOWN_ERROR: {
      //   errCode: -1,
      //   msg: 'UNKNOWN_ERROR',
      //   msgZh: '未知异常'
      // }
    },
    Logger: {
      // 日志的输出
      appenders: {
        access: {
          type: 'dateFile',
          pattern: '-yyyy-MM-dd.log', //生成文件的规则
          alwaysIncludePattern: true, // 文件名始终以日期区分
          encoding: 'utf-8',
          filename: p.join(process.cwd(), './logs/access'), //生成文件名
          maxLogSize: 5 * 1000 * 1000, // 超过多少(byte)就切割
          keepFileExt: true // 切割的日志保留文件扩展名，false(默认):生成类似default.log.1文件;true:生成类似default.1.log
        },
        application: {
          type: 'dateFile',
          pattern: '-yyyy-MM-dd.log',
          alwaysIncludePattern: true,
          encoding: 'utf-8',
          filename: p.join(process.cwd(), './logs/application'),
          maxLogSize: 5 * 1000 * 1000,
          keepFileExt: true
        },
        out: {
          type: 'console'
        }
      },
      categories: {
        access: { appenders: ['access'], level: 'info' },
        application: { appenders: ['application'], level: 'all' },
        default: { appenders: ['application'], level: 'all' }
      }
    }
  },
  middlewares: {
    Cors: {
      match: '/',
      opts: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Expose-Headers': '*',
        'Access-Control-Max-Age': 60,
        'Access-Control-Allow-Methods': 'PUT, POST, GET, DELETE, OPTIONS'
      }
    },
    BodyParser: {
      match: '/',
      opts: {
        multipart: true,
        formidable: {
          maxFileSize: 200 * 1024 * 1024, // 设置上传文件大小最大限制，默认2M
          keepExtensions: true // 保持后缀名
        }
      }
    },
    Compress: {
      match: '/',
      opts: {
        filter: function (content_type) {
          return /text/i.test(content_type);
        },
        threshold: 2048,
        flush: require('zlib').Z_SYNC_FLUSH
      }
    },
    Assets: {
      match: '/',
      mapping: './static',
      opts: {
        index: 'index.html', // 默认为true  访问的文件为index.html  可以修改为别的文件名
        hidden: false, // 是否同意传输隐藏文件
        defer: false // 如果为true，则在返回next()之后进行服务，从而允许后续中间件先进行响应
      }
    },
    TemplateHandler: {
      mapping: './template',
      opts: { extension: 'ejs' }
    },
    DynamicRoutes: {
      opts: [{ match: '/api', dir: '/api' }]
    }
  }
};

```

## 程序使用

```javascript

// main.js
// 默认 localhost:8360
const { Application } = require('@esidecn/leopold-base');
const config = require('./app.config');
const p = require('path');
const router = require('./router');
const app = new Application(config);
// 其他中间件函数
app.server.use(async (ctx, next) => {
  await next();
});
app.server.use(router.routes(), router.allowedMethods());
app.start();
```


## CURD 范例
```javascript
// dayjs.js
const dayjs = require('dayjs');
dayjs.locale('zh-cn');

/**
 * 日期格式化
 * @param d
 * @param format  YYYY/MM/DD HH:mm:ss
 */
const formatDate = (d, format = 'YYYY/MM/DD HH:mm:ss') => {
  return dayjs(d).format(format);
};

// filter.js
/**
 * 使用model过滤结果集
 * @param dbResult
 * @param filter
 * @returns {*}
 */
const filterDbResult = (dbResult, filter) => {
    if (dbResult) {
        return dbResult.map((item) => {
            for (const key in filter) {
                const filterFn = filter[key];
                if (item[key] !== undefined && item[key] !== null) {
                    item[key] = filterFn(item[key], item) || item[key];
                }
            }
            return item;
        });
    } else {
        return [];
    }
};

module.exports = {
    filterDbResult
};

// validator.js
/**
 * 收集必填的规则
 * @param model
 * @returns {{}}
 */
const getRequiredRules = (model) => {
    let validator = {};
    for (const key in model._column) {
        validator[key] = [];
        const columnItem = model._column[key];
        if (columnItem.primaryKey || (columnItem.allowNull !== void 0 && !columnItem.allowNull)) {
            if (!columnItem.defaultExpr) {
                const requiredFn = (val) => {
                    if (val) return true;
                    else return false;
                };
                validator[key].push({
                    message: `字段${key}需要必填，请检查输入`,
                    fn: requiredFn
                });
            }
        }
    }
    return validator;
};

/**
 * 根据必填项验证参数
 * @param params
 * @param rules
 * @returns {[boolean,string]}
 */
const validateRules = (params = {}, rules = {}) => {
    let err = false;
    let errMsg = '';
    for (const key in rules) {
        const validList = rules[key];
        if (validList && validList.length > 0) {
            for (const validItem of validList) {
                if (!validItem.fn(params[key])) {
                    err = true;
                    errMsg = validItem.message;
                }
            }
        }
    }
    return [err, errMsg];
};

module.exports = {
    getRequiredRules,
    validateRules
}


// serviceUtil.js
const { formatDate } = require('./dayjs');
const { filterDbResult } = require('./filter');
const { getRequiredRules, validateRules } = require('./validator');
// const { formatHumpLineTransfer } = require('../utils/formatter');

/**
 * 创建表格
 * @param ctx
 * @param model
 * @returns {Promise<{msg: string, errCode: number, msgZh: string}>}
 */
const createTable = async (ctx, model) => {
    const { mysql } = ctx.$root.DB;
    const { Result } = ctx.$root;
    const res = Object.assign({}, Result.STATUS_CODE.SUCCESS);
    const err = Object.assign({}, Result.STATUS_CODE.SQL_ERROR);
    const sql = model.getCreateTableSql();
    try {
        res.data = await mysql.pureQuery(sql);
        return res;
    } catch (e) {
        err.data = e.message;
        return err;
    }
};

/**
 * 记录总数
 * @param ctx
 * @param model
 * @param cond
 * @returns {Promise<*>}
 */
const count = async (ctx, model, cond = {}) => {
    const { mysql } = ctx.$root.DB;
    const [sql] = model.select(['*']).addCond(cond).count().sql();
    const res = await mysql.pureQuery(sql);
    if (res && res.length > 0) {
        return res[0].total;
    } else {
        return null;
    }
};

/**
 * 记录分页详情
 * @param ctx
 * @param model
 * @param cond
 * @returns {Promise<*>}
 */
const page = async (ctx, model, cond = {}) => {
    const countResult = await count(ctx, model, cond);
    let totalPage = 1;
    let totalSize = countResult;
    if (cond.pageSize && cond.pageSize > 0) {
        totalPage = Math.ceil(totalSize / cond.pageSize);
    }
    return {
        totalPage,
        totalSize
    };
};

/**
 * 记录列表
 * @param ctx
 * @param model
 * @param cond
 * @returns {Promise<*>}
 */
const list = async (ctx, model, cond = {}) => {
    const { mysql } = ctx.$root.DB;
    const { Result } = ctx.$root;
    const res = Object.assign({}, Result.STATUS_CODE.SUCCESS);
    const err = Object.assign({}, Result.STATUS_CODE.SQL_ERROR);
    try {
        const pageResult = await page(ctx, model, cond);
        const [sql] = model.select(['*']).addCond(cond).sql();
        const dbResult = await mysql.pureQuery(sql);
        const userFilter = model._filter || {};
        pageResult.list = filterDbResult(dbResult, userFilter);
        res.data = pageResult;
        return res;
    } catch (e) {
        console.log(e);
        err.data = e.message;
        return err;
    }
};

/**
 * 查询单个model
 * @param ctx
 * @param model
 * @param cond
 * @returns {Promise<null|*>}
 */
const listOne = async (ctx, model, cond = {}) => {
    const { mysql } = ctx.$root.DB;
    const { Result } = ctx.$root;
    const res = Object.assign({}, Result.STATUS_CODE.SUCCESS);
    const err = Object.assign({}, Result.STATUS_CODE.SQL_ERROR);
    try {
        const [sql] = model.select(['*']).addCond(cond).sql();
        const dbResult = await mysql.pureQuery(sql);
        const userFilter = model._filter || {};
        const filterResult = filterDbResult(dbResult, userFilter);
        if (filterResult && filterResult.length > 0) {
            res.data = filterResult[0];
        } else {
            res.data = null;
        }
        return res;
    } catch (e) {
        err.data = e.message;
        return err;
    }
};

/**
 * 新建
 * @param ctx
 * @param model
 * @param params
 * @returns {Promise<void>}
 */
const save = async (ctx, model, params = {}) => {
    const { mysql } = ctx.$root.DB;
    const { Result } = ctx.$root;
    const res = Object.assign({}, Result.STATUS_CODE.SUCCESS);
    const paramErr = Object.assign({}, Result.STATUS_CODE.PARAM_ERROR);
    const sqlErr = Object.assign({}, Result.STATUS_CODE.SQL_ERROR);
    const unknownErr = Object.assign({}, Result.STATUS_CODE.UNKNOWN_ERROR);
    const rules = getRequiredRules(model);
    const [err, errMsg] = validateRules(params, rules);
    if (!err) {
        const [sql] = model.create(params).sql();
        try {
            const dbResult = await mysql.pureQuery(sql);
            /*
              OkPacket {
                fieldCount: 0,
                affectedRows: 1,
                insertId: 0,
                serverStatus: 2,
                warningCount: 0,
                message: '',
                protocol41: true,
                changedRows: 0
              }
             */
            if (dbResult && dbResult.affectedRows > 0) {
                res.data = 'success';
                return res;
            } else {
                return unknownErr;
            }
        } catch (e) {
            sqlErr.data = e.message;
            return sqlErr;
        }
    } else {
        paramErr.data = errMsg;
        return paramErr;
    }
};

/**
 * 更新
 * @param ctx
 * @param model
 * @param params
 * @param isUpdateAt
 * @param pk
 * @returns {Promise<void>}
 */
const update = async (ctx, model, params = {}, isUpdateAt = true, pk = 'code') => {
    if (isUpdateAt && !params['update_at']) {
        params['update_at'] = formatDate(new Date(), 'YYYY/MM/DD HH:mm:ss');
    }
    const { mysql } = ctx.$root.DB;
    const { Result } = ctx.$root;
    const res = Object.assign({}, Result.STATUS_CODE.SUCCESS);
    const sqlErr = Object.assign({}, Result.STATUS_CODE.SQL_ERROR);
    const unknownErr = Object.assign({}, Result.STATUS_CODE.UNKNOWN_ERROR);
    const cond = { [pk]: params[pk] };
    const modelObj = Object.assign({}, params);
    delete modelObj[pk];
    const [sql] = model.update(modelObj).addCond(cond).sql();
    try {
        const dbResult = await mysql.pureQuery(sql);
        /*
            OkPacket {
              fieldCount: 0,
              affectedRows: 1,
              insertId: 0,
              serverStatus: 2,
              warningCount: 0,
              message: '',
              protocol41: true,
              changedRows: 1
            }
           */
        if (dbResult) {
            res.data = 'success';
            return res;
        } else {
            return unknownErr;
        }
    } catch (e) {
        sqlErr.data = e.message;
        return sqlErr;
    }
};

/**
 * 软移除
 * @param ctx
 * @param model
 * @param params
 * @param isUpdateAt
 * @param softKey
 * @param pk
 * @returns {Promise<void>}
 */
const remove = async (ctx, model, params = {}, isUpdateAt = true, softKey = 'state', pk = 'code') => {
    if (isUpdateAt && !params['update_at']) {
        params['update_at'] = formatDate(new Date(), 'YYYY/MM/DD HH:mm:ss');
    }
    const { mysql } = ctx.$root.DB;
    const { Result } = ctx.$root;
    const res = Object.assign({}, Result.STATUS_CODE.SUCCESS);
    const sqlErr = Object.assign({}, Result.STATUS_CODE.SQL_ERROR);
    const unknownErr = Object.assign({}, Result.STATUS_CODE.UNKNOWN_ERROR);
    const cond = { [pk]: params[pk] };
    const modelObj = { [softKey]: 3 };
    delete model[pk];
    const [sql] = model.update(modelObj).addCond(cond).sql();
    try {
        const dbResult = await mysql.pureQuery(sql);
        /*
          OkPacket {
            fieldCount: 0,
            affectedRows: 1,
            insertId: 0,
            serverStatus: 2,
            warningCount: 0,
            message: '',
            protocol41: true,
            changedRows: 1
          }
         */
        if (dbResult) {
            res.data = 'success';
            return res;
        } else {
            return unknownErr;
        }
    } catch (e) {
        sqlErr.data = e.message;
        return sqlErr;
    }
};

module.exports = {
    createTable,
    count,
    list,
    listOne,
    save,
    update,
    remove
};


// server/user/list.js 中使用
const serviceUtil = require('../../utils/serviceUtil');
const UserModel = require('../../model/UserModel');

/**
 * 查询用户列表
 * @param ctx
 * @returns {Promise<void>}
 */
module.exports = async (ctx) => {
    const { Result } = ctx.$root;
    if (ctx.method === 'POST') {
        ctx.body = await serviceUtil.list(ctx, UserModel, ctx.request.body);
    } else if (ctx.method === 'GET') {
        ctx.body = Result.fail(null, 'unsupported', Result.STATUS_CODE.UNKNOWN_ERROR);
    }
};

```

## Model定义参考

```javascript
const { SQLModel, SQLModelType } = require('@esidecn/leopold-base');

const UserModel = new SQLModel({
  table: 'tb_user',
  column: {
    code: {
      type: SQLModelType.VARCHAR(100),
      allowNull: false,
      unique: true,
      primaryKey: true,
      comment: '用户code'
    },
    fk_group: {
      type: SQLModelType.VARCHAR(100),
      allowNull: false,
      defaultExpr: 'leopold',
      comment: '用户所在group'
    },
    fk_department: {
      type: SQLModelType.VARCHAR(100),
      comment: '用户所在部门'
    },
    account: {
      type: SQLModelType.VARCHAR(100),
      allowNull: false,
      unique: true,
      comment: '用户账号'
    },
    passwd: {
      type: SQLModelType.VARCHAR(100),
      allowNull: false,
      unique: true,
      comment: '用户密码'
    },
    name: {
      type: SQLModelType.VARCHAR(50),
      comment: '用户名称'
    },
    description: {
      type: SQLModelType.VARCHAR(100),
      comment: '用户描述'
    },
    sex: {
      type: SQLModelType.INTEGER(),
      defaultExpr: '0',
      comment: '用户性别 男(1) 女(2) 未知(0)'
    },
    phone_area_code: {
      type: SQLModelType.VARCHAR(10),
      defaultExpr: '86'
    },
    phone: {
      type: SQLModelType.VARCHAR(20)
    },
    email: {
      type: SQLModelType.VARCHAR(20)
    },
    state: {
      type: SQLModelType.INTEGER(),
      allowNull: false,
      defaultExpr: '1',
      comment: '正常(1) 锁定(2) 注销(3)'
    },
    update_at: {
      type: SQLModelType.DATETIME(),
      defaultExpr: 'CURRENT_TIMESTAMP',
      otherExpr: 'ON UPDATE CURRENT_TIMESTAMP'
    },
    create_at: {
      type: SQLModelType.DATETIME(),
      defaultExpr: 'CURRENT_TIMESTAMP'
    }
  },
  ref: [
    // {
    //   table: 'tb_group',
    //   where: 'tb_group.code = tb_user.fk_group',
    //   column: {
    //     name: {
    //       alias: 'fkGroupName'
    //     }
    //   }
    // },
    {
      table: 'tb_department',
      where: 'tb_department.code = tb_user.fk_department',
      column: {
        name: {
          alias: 'fkDepartmentName'
        }
      }
    }
  ],
  filter: {
    passwd: (val, row = {}) => {
      return '**********';
    },
    sex: (val, row = {}) => {
      if (val === 1) {
        row.sex_name = '男';
      } else if (val === 2) {
        row.sex_name = '女';
      } else {
        row.sex_name = '未知';
      }
      return val;
    },
    phone: (val, row = {}) => {
      let phone = val;
      phone = phone.replace(phone.substring(3, 7), '****');
      return phone;
    },
    state: (val, row = {}) => {
      if (val === 1) {
        row.state_name = '正常';
      } else if (val === 2) {
        row.state_name = '锁定';
      } else {
        row.state_name = '注销';
      }
      return val;
    }
  }
});

module.exports = UserModel;
```

## Log使用范例

```javascript
// server/index.js
module.exports = async (ctx) => {
  const { Result, Log } = ctx.$root;
  const logger = Log.getLogger('application')
  logger.info('写入信息到log')
  ctx.body = Result.success(ctx, 'success');
};
```

## fix记录
+ 0.0.3
  + 移除ErrorHandler
  + 2024/01/14 data数据多余的‘’拼接问题
  + 2024/01/15 补充OrderBy与GroupBy初步支持
  + 2024/01/21 全部参数化,可以按需使用配置文件覆盖原始的部分配置
+ 0.0.5
  + 2024/04/04 Log配置提升
  + 2024/04/04 常用工具，直接挂载到ctx
+ 0.0.6
  + 2024/04/21 修改入口与插件使用方式
+ 0.0.7
  + 2024/05/11 动态路由无next,默认作为终结点，进一步简化配置使用
  + 2024/05/11 开发load来提供更灵活的顺序加载方式，开放use提供自定义插件加载入口
  + 2024/05/11 优化库的输出文件及其目录文件结构，提供更好的类型提示支持
  + 2024/05/13 针对性的路由插件处理,提供默认加载的插件方式，和后期开放性的内置可选插件加载方式