import mysql from 'mysql';

/**
 * 格式化sql
 * @param sql
 * @param params
 */
const formatSql = function (sql, params) {
  return mysql.format(sql, params);
};

export { formatSql };
