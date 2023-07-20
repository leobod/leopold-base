const mysql = require('mysql');
const config = require('../config');

/**
 * 开启pool
 */
const pool = mysql.createPool(config.mysql);

const RDB = {
  formatSql: function (sql, params) {
    // 'UPDATE posts SET modified = ? WHERE id = ?'
    return mysql.format(sql, params);
  },

  query: function (sql, values, isRelease = true) {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) {
          reject(err);
        } else {
          connection.query(sql, values, (err, result) => {
            if (err) reject(err);
            else resolve(result);
            if (isRelease) {
              connection.release();
            }
          });
        }
      });
    });
  },
  pureQuery: function (sql, isRelease = true) {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) {
          reject(err);
        } else {
          connection.query(sql, (err, result) => {
            if (err) reject(err);
            else resolve(result);
            if (isRelease) {
              connection.release();
            }
          });
        }
      });
    });
  },

  trans: function (tranFn) {
    return new Promise((resolve, reject) => {
      //返回promise提供事务成功与失败的接口
      pool.getConnection((err, connection) => {
        if (err) {
          reject(err);
        } else {
          connection.beginTransaction((err) => {
            //开始事务处理
            if (err) {
              connection.release();
              reject(err);
            } else {
              let promise = tranFn(connection); //调用事务处理函数
              promise
                .then((result) => {
                  connection.commit((err) => {
                    //事务处理函数resolve则提交事务
                    if (err) {
                      reject(err);
                      connection.release();
                    } else {
                      resolve(result);
                      connection.release();
                    }
                  });
                })
                .catch((err) => {
                  connection.rollback(() => {
                    //事务处理函数reject则回滚事务
                    reject(err);
                    connection.release();
                  });
                });
            }
          });
        }
      });
    });
  },

  createTable: function (sql) {
    return RDB.query(sql, []);
  }
};

export { pool, RDB };
