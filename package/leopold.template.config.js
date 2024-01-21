const p = require('path');

module.exports = {
  path: '.',
  port: 8360,
  DB: {
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
  STATUS_CODE: {
    // UNKNOWN_ERROR: {
    //   errCode: 1,
    //   msg: 'UNKNOWN_ERROR',
    //   msgZh: '未知异常'
    // }
  },
  Middlewares: {
    Log: {
      enabled: true,
      config: {
        mapping: './logs',
        opts: {
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
            default: { appenders: ['out'], level: 'info' },
            access: { appenders: ['access'], level: 'info' },
            application: { appenders: ['application'], level: 'all' }
          }
        }
      }
    },
    Cors: {
      enabled: true,
      config: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Expose-Headers': '*',
        'Access-Control-Max-Age': 60,
        'Access-Control-Allow-Methods': 'PUT, POST, GET, DELETE, OPTIONS'
      }
    },
    BodyParser: {
      enabled: true,
      config: {
        opts: {
          multipart: true,
          formidable: {
            maxFileSize: 200 * 1024 * 1024, // 设置上传文件大小最大限制，默认2M
            keepExtensions: true // 保持后缀名
          }
        }
      }
    },
    Compress: {
      enabled: true,
      config: {
        opts: {
          filter: function (content_type) {
            return /text/i.test(content_type);
          },
          threshold: 2048
        }
      }
    },
    Assets: {
      enabled: true,
      config: {
        path: '/',
        mapping: './static',
        opts: {
          index: 'index.html', // 默认为true  访问的文件为index.html  可以修改为别的文件名
          hidden: false, // 是否同意传输隐藏文件
          defer: false // 如果为true，则在返回next()之后进行服务，从而允许后续中间件先进行响应
        }
      }
    },
    TemplateHandler: {
      enabled: true,
      config: {
        mapping: './template'
      }
    },
    DynamicRoutes: {
      enabled: true,
      config: {
        routes: [
          { dir: '/server', mapping: '/api' },
          { dir: '/views', mapping: '/' }
        ]
      }
    }
  },
  Plugins: {}
};
