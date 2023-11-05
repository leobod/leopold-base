"use strict";
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
    //     connectionLimit: 50 // 最大连接数
    //   }
    // }
    },
    Middlewares: {
        Assets: {
            enabled: true,
            config: {
                path: '/assets',
                mapping: './assets',
                opts: {
                    index: true,
                    hidden: false,
                    defer: false // 如果为true，则在返回next()之后进行服务，从而允许后续中间件先进行响应
                }
            }
        },
        BodyParser: {
            enabled: true,
            config: {
                opts: {
                    multipart: true,
                    formidable: {
                        maxFileSize: 200 * 1024 * 1024,
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
        Cors: {
            enabled: true
        },
        DynamicRoutes: {
            enabled: true,
            config: {
                routes: [{ expr: '/api/*', mapping: './app/api/*' }]
            }
        },
        ErrorHandler: {
            enabled: true
        },
        TemplateHandler: {
            enabled: true,
            config: {
                mapping: './web'
            }
        },
        Log: {
            enabled: true,
            config: {
                mapping: './logs'
            }
        }
    },
    Plugins: {}
};
