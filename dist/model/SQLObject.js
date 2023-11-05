"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SQLObject = void 0;
const getSqlModel = function () {
    return {
        query: 'SELECT',
        tables: [],
        fields: [],
        data: [],
        where: [],
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
    let sql = '';
    let value = model.data || [];
    const hasWhere = !!(model.where && model.where.length > 0);
    if (query === 'SELECT') {
        tableSql = model.tables.join(', ');
        fieldSql = model.fields.join(', ');
        whereSql = model.where.join(' ');
        const hasPageSize = !!model.options.pageSize;
        const hasPageNum = !!model.options.pageNum;
        let pageSql = '';
        if (hasPageSize) {
            const { pageNum, pageSize } = model.options;
            if (hasPageNum) {
                const offset = (Number(pageNum) - 1) * Number(pageSize);
                pageSql = `LIMIT ${offset}, ${pageSize}`;
            }
            else {
                pageSql = `LIMIT ${pageSize}`;
            }
        }
        sql = `SELECT ${fieldSql} FROM ${tableSql} ${hasWhere ? 'WHERE ' + whereSql : ''} ${pageSql ? pageSql : ''};`;
    }
    else if (query === 'UPDATE') {
        if (model.tables.length > 1) {
            throw new Error(`${query} cant have 2 more tables`);
        }
        tableSql = model.tables.join(', ');
        fieldSql = model.fields.map((item) => `${item} = ? `).join(', ');
        whereSql = model.where.join(' ');
        sql = `UPDATE ${tableSql} SET ${fieldSql} ${hasWhere ? 'WHERE ' + whereSql : ''};`;
    }
    else if (query === 'DELETE') {
        if (model.tables.length > 1) {
            throw new Error(`${query} cant have 2 more tables`);
        }
        tableSql = model.tables.join(', ');
        whereSql = model.where.join(' ');
        sql = `DELETE FROM ${tableSql} ${hasWhere ? 'WHERE ' + whereSql : ''};`;
    }
    else if (query === 'INSERT') {
        if (model.tables.length > 1) {
            throw new Error(`${query} cant have 2 more tables`);
        }
        tableSql = model.tables.join(', ');
        fieldSql = model.fields.join(', ');
        dataSql = model.data.join(', ');
        sql = `INSERT INTO ${tableSql} (${fieldSql}) VALUES(${dataSql});`;
    }
    return [sql, value, query];
};
const toColumnList = function (column = {}, table = '') {
    const tableName = table;
    const columnList = [];
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
exports.SQLObject = SQLObject;
