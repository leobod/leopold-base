const mysql = require('mysql');
// return mysql.format(sql, params);

/*
class SQLObject {
  query: string;
  tables: Array<any>;
  fields: Array<any>;
  data: Array<any>;
  where: Array<any>;
  append: {
    'GROUP BY': string;
    'ORDER BY': string;
  };
  options: {
    pageNum: string | number | null;
    pageSize: string | number | null;
  };
}
*/

const getSqlModel = function () {
  return {
    query: 'SELECT', // SELECT/UPDATE/DELETE/INSERT
    tables: [], // table name
    fields: [],
    data: [],
    where: [],
    join: [],
    append: {
      'GROUP BY': '',
      'ORDER BY': ''
    },
    options: {
      pageNum: null,
      pageSize: null
    }
  };
};

const getQsvModel = function () {
  return {
    query: '',
    sql: '',
    value: []
  };
};

const toQsv = function (model) {
  let query = model.query.toUpperCase();
  let tableSql = '';
  let fieldSql = '';
  let dataSql = '';
  let whereSql = '';
  let joinSql = '';
  let sql = '';
  let preSql = '';
  let value = model.data || [];
  const hasWhere = !!(model.where && model.where.length > 0);
  const hasJoin = !!(model.join && model.join.length > 0);
  if (query === 'SELECT') {
    tableSql = model.tables.map((name) => `${name} ${name}`).join(', ');
    fieldSql = model.fields.join(', ');
    whereSql = model.where.join(' ');
    joinSql = model.join.join(' ');
    const hasPageSize = !!model.options.pageSize;
    const hasPageNum = !!model.options.pageNum;
    const hasOrderBy = !!model.append['ORDER BY']
    const hasGroupBy = !!model.append['GROUP BY']
    let pageSql = '';
    if (hasPageSize) {
      const { pageNum, pageSize } = model.options;
      if (hasPageNum) {
        const offset = (Number(pageNum) - 1) * Number(pageSize);
        pageSql = `LIMIT ${offset}, ${pageSize}`;
      } else {
        pageSql = `LIMIT ${pageSize}`;
      }
    }
    const orderBySql = hasOrderBy ? `ORDER BY ${model.append['ORDER BY']}` : '';
    const groupBySql = hasGroupBy ? `GROUP BY ${model.append['GROUP BY']}` : '';

    preSql = `SELECT ${fieldSql} FROM ${tableSql} ${hasJoin ? joinSql : ''} ${hasWhere ? 'WHERE ' + whereSql : ''} ${pageSql ? pageSql : ''} ${orderBySql} ${groupBySql};`;
  } else if (query === 'UPDATE') {
    if (model.tables.length > 1) {
      throw new Error(`${query} cant have 2 more tables`);
    }
    tableSql = model.tables.join(', ');
    fieldSql = model.fields.map((item) => `${item} = ? `).join(', ');
    whereSql = model.where.join(' ');
    preSql = `UPDATE ${tableSql} SET ${fieldSql} ${hasWhere ? 'WHERE ' + whereSql : ''};`;
  } else if (query === 'DELETE') {
    if (model.tables.length > 1) {
      throw new Error(`${query} cant have 2 more tables`);
    }
    tableSql = model.tables.join(', ');
    whereSql = model.where.join(' ');
    preSql = `DELETE FROM ${tableSql} ${hasWhere ? 'WHERE ' + whereSql : ''};`;
  } else if (query === 'INSERT') {
    if (model.tables.length > 1) {
      throw new Error(`${query} cant have 2 more tables`);
    }
    tableSql = model.tables.join(', ');
    fieldSql = model.fields.join(', ');
    dataSql = new Array(model.fields.length).fill('?').join(', ');
    preSql = `INSERT INTO ${tableSql} (${fieldSql}) VALUES(${dataSql});`;
  }
  sql = mysql.format(preSql, value);
  return [sql, preSql, value, query];
};

const toColumnList = function (column = {}, table = '') {
  const tableName = table;
  const columnList: Array<any> = [];
  for (const key in column) {
    const columnItem = column[key];
    const alias = columnItem.alias || key;
    columnList.push(`${tableName}.${key} as ${alias}`);
  }
  return columnList;
};

const SQLObject = {
  getSqlModel,
  getQsvModel,
  toQsv,
  toColumnList
};

export { SQLObject };
