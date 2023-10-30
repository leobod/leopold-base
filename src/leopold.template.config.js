module.exports = {
  path: '.',
  port: 8360,
  database: {
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
  dynamicRoutes: {
    enabled: true,
    opts: {
      routes: [
        { expr: '/api/*', mapping: './app/api/*' }
      ]
    }
  },
  logs: {
    enabled: true,
    opts: {
      path: './app/logs'
    }
  },
  assets: {
    enabled: true,
    opts: {
      path: './app/assets'
    }
  },
  file: {
    enabled: true,
    opts: {
      path: './app/file'
    }
  },
  web: {
    enabled: true,
    opts: {
      path: './app/web'
    }
  },
  websocket: {
    enabled: true
  }
};
