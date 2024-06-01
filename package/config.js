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
      //     host: '127.0.0.1',
      //     port: '6379',
      //     maxConnections: 5 // 最大连接数
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
