<h1 align="center">leopold-base</h1>

## 项目介绍

> 本项目基于 koa 进行二次开发.

通过组合常用的koa插件，实现基于此项目可以快速的开发其他网络服务程序。
对于网络请求：设计中已匹配静态页面为优先，其次匹配动态网页渲染，最后是api服务，通过制定配置文件，根据发展需要，不断提供更多可供设计人员使用的工具与服务。

## 当前集成插件

- [x] Cors跨域请求处理(简易版)
- [x] 静态文件(基于koa-mount，koa-static，并提供有限的配置自定义)
- [x] Log4j日志系统(简易版)
- [x] 请求体处理(基于koa-body，并提供有限的配置自定义)
- [x] 页面压缩
- [x] 模板引擎(基于ejs)
- [x] 动态路由自动注册(使用path-match定制)

## 提供的工具

- [x] 统一返回结果处理
- [x] 定时任务设置
- [x] Redis的集成使用
- [x] Mysql的集成使用
- [x] 基于数据模型的数据库CURD

## 配置文件范例

```javascript
// config.js
const p = require('path');

module.exports = {
  path: '.',
  port: 8360,
  modules: {
    Mail: {
      // msg: {
      //   type: 'NODEMAILER',
      //   name: '',
      //   config: {
      //     host: 'smtp.qiye.aliyun.com',
      //     port: 465,
      //     auth: {
      //       user: '',
      //       pass: ''
      //     },
      //     secure: true
      //   }
      // }
    },
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
      //     password: '',
      //     socket: {
      //       host: '127.0.0.1',
      //       port: '6379',
      //     },
      //   }
      // }
    },
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
      mapping: '/server/template',
      opts: { extension: 'ejs' }
    },
    DynamicRoutes: {
      opts: [{ match: '/api/', dir: '/server/api' }]
    }
  }
};
```

## 程序使用

```javascript
// main.js
// 默认 localhost:8360
const { Leopold } = require('@eside/leopold');

const leopold = new Leopold();
leopold.load();
// 其他中间件函数
leopold.registerServerModule(async (ctx, next) => {
  await next();
});
leopold.server.use(router.routes(), router.allowedMethods());
leopold.start();
```

## CURD 范例

```javascript
// server/model/UserModel.js
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
    sex: {
      type: SQLModelType.INTEGER(),
      defaultExpr: '0',
      comment: '用户性别 男(1) 女(2) 未知(0)'
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
  ref: {
    tb_department: 'tb_department.code = tb_user.fk_department'
  },
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
    }
  }
});
module.exports = UserModel;

// server/services/UserService
const { Service } = require('@eside/leopold');
const UserModel = require('../model/UserModel');
module.exports = class UserService extends DefaultService {
  constructor() {
    // format 代表数据库字段格式到显示字段，此处为数据库使用下划线格式，前台使用驼峰格式
    super(UserModel, { format: 'Line2Camel' });
  }

  async list(ctx, params = {}, opts = {}) {
    ctx.body = ctx.result(await super.list(ctx, params, opts));
  }

  async login(ctx, params = {}, opts = {}) {
    try {
      // 业务逻辑
    } catch (e) {
      if (this.error_custom) {
        throw new Error(this.error_message);
      } else {
        throw e;
      }
    }
  }
};

// server/api/user.js
const { GET, POST, AUTH, filterNullProps } = require('@eside/leopold');
const UserService = require('@server/services/UserService');
module.exports = {
  list: POST(async (ctx) => {
    const finalParams = filterNullProps(Object.assign({}, ctx.request.body));
    await userService.list(ctx, finalParams);
  }),
  get: GET(async (ctx) => {
    const finalParams = filterNullProps(Object.assign({}, ctx.request.query));
    await userService.listOne(ctx, finalParams);
  })
};
```

## fix记录

- 0.0.3
  - 移除ErrorHandler
  - 2024/01/14 data数据多余的‘’拼接问题
  - 2024/01/15 补充OrderBy与GroupBy初步支持
  - 2024/01/21 全部参数化,可以按需使用配置文件覆盖原始的部分配置
- 0.0.5
  - 2024/04/04 Log配置提升
  - 2024/04/04 常用工具，直接挂载到ctx
- 0.0.6
  - 2024/04/21 修改入口与插件使用方式
- 0.0.7
  - 2024/05/11 动态路由无next,默认作为终结点，进一步简化配置使用
  - 2024/05/11 开发load来提供更灵活的顺序加载方式，开放use提供自定义插件加载入口
  - 2024/05/11 优化库的输出文件及其目录文件结构，提供更好的类型提示支持
  - 2024/05/13 针对性的路由插件处理,提供默认加载的插件方式，和后期开放性的内置可选插件加载方式
  - 2024/05/15 动态路由匹配规则优化与精简，补充playground，说明如何使用库文件
  - 2024/05/18 精简配置，与sqlModel的定义
- 0.0.9
  - 2024/05/19 修改默认api文件夹路径，简化result设置与使用
- 0.0.10
  - 2024/05/19 修复动态路由未匹配到时的后续动作，避免后续加载的自定义模块无法加载问题
  - 2024/06/01 补充内置邮件发送工具
- 0.0.11
  - 2024/06/02 修复orderBy无法链式调用问题
- 0.0.12
  - 2024/06/19 补充Service,Controller,路由中单文件符合路由支持
- 0.0.13
  - 2024/06/22 修复动态路由，子属性为index的问题
  - 2024/06/22 补充动态路由的使用方法
  - 2024/06/23 补充Service字段转换内置,部分重置Service使用,提供DefaultService
- 0.0.20
  - 2024/06/24 移除DefaultService,交由Service做，将动作留给使用者决定。开放更多的常用方法类。
  - 2024/06/25 Service中OrderBy优化
  - 2024/06/25 修复OrderBy使用后SQl语句顺序问题
  - 2024/06/25 修复空值过滤
- 0.0.22
  - 2024/06/28 修复不存在的字段自动过滤 ，简单自然连接查询sql语句错误，简单自然连接改左连接
