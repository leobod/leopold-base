module.exports = {
  path: '.',
  port: 8360,
  modules: {
    Db: {
      redis: {
        type: 'REDIS',
        config: {
          host: '127.0.0.1',
          port: '6379',
          maxConnections: 5 // 最大连接数
        }
      }
    }
  }
};
