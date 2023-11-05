"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MysqlRDB = void 0;
const mysql = require('mysql');
class MysqlRDB {
    constructor(config = {}) {
        const configTemplate = {
            host: '',
            port: '3306',
            database: '',
            user: '',
            password: '',
            encoding: 'utf8mb4',
            dateStrings: true,
            connectionLimit: 50,
            prefix: ''
        };
        this.config = Object.assign({}, configTemplate, config);
        this.pool = mysql.createPool(this.config);
    }
    /**
     * SQL模板替换
     * @param sql
     * @param params
     * @returns {string}
     */
    formatSql(sql, params) {
        // 'UPDATE posts SET modified = ? WHERE id = ?'
        return mysql.format(sql, params);
    }
    /**
     * 模板替换SQL执行
     * @param sql
     * @param values
     * @param isRelease
     * @returns {Promise<unknown>}
     */
    query(sql, values, isRelease = true) {
        return new Promise((resolve, reject) => {
            this.pool.getConnection((err, connection) => {
                if (err) {
                    reject(err);
                }
                else {
                    connection.query(sql, values, (err, result) => {
                        if (err)
                            reject(err);
                        else
                            resolve(result);
                        if (isRelease) {
                            connection.release();
                        }
                    });
                }
            });
        });
    }
    /**
     * 存粹SQL执行
     * @param sql
     * @param isRelease
     * @returns {Promise<unknown>}
     */
    pureQuery(sql, isRelease = true) {
        return new Promise((resolve, reject) => {
            this.pool.getConnection((err, connection) => {
                if (err) {
                    reject(err);
                }
                else {
                    connection.query(sql, (err, result) => {
                        if (err)
                            reject(err);
                        else
                            resolve(result);
                        if (isRelease) {
                            connection.release();
                        }
                    });
                }
            });
        });
    }
    /**
     * 事务
     * @param tranFn
     * @returns {Promise<unknown>}
     */
    trans(tranFn) {
        return new Promise((resolve, reject) => {
            //返回promise提供事务成功与失败的接口
            this.pool.getConnection((err, connection) => {
                if (err) {
                    reject(err);
                }
                else {
                    connection.beginTransaction((err) => {
                        //开始事务处理
                        if (err) {
                            connection.release();
                            reject(err);
                        }
                        else {
                            let promise = tranFn(connection); //调用事务处理函数
                            promise
                                .then((result) => {
                                connection.commit((err) => {
                                    //事务处理函数resolve则提交事务
                                    if (err) {
                                        reject(err);
                                        connection.release();
                                    }
                                    else {
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
    }
}
exports.MysqlRDB = MysqlRDB;
