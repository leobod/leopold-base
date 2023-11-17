const { SQLObject } = require('./SQLObject');

export class SQLModel {
  _table: any;
  _filter: any;
  _column: {
    [key: string]: {
      type: {
        [key: string]: any;
      };
      allowNull?: any;
      autoIncrement?: any;
      unique?: any;
      primaryKey?: any;
      defaultExpr?: any;
      comment?: any;
    };
  };
  _rules: any;
  _updateRules: any;
  _ref: any;
  _sqlObject: any;
  static PAGE_RULES: {
    page: { isPageNum: true };
    size: { isPageSize: true };
  };

  constructor(options) {
    this._table = options.table || null;
    this._column = options.column || {};
    this._filter = options.filter || {};
    this._rules = Object.assign({}, SQLModel.PAGE_RULES, options.rules || {});
    this._updateRules = options.updateRules || {};
    this._ref = options.ref || [];
    this._sqlObject = SQLObject.getSqlModel();
  }

  resetSqlObject() {
    this._sqlObject = SQLObject.getSqlModel();
  }

  getCreateTableSql(opt = { force: false, wrap: false }) {
    const { force, wrap } = opt;
    const contentList: Array<any> = [];
    const pkList: Array<any> = [];
    for (const key in this._column) {
      const columnSqlList: Array<any> = [];
      const columnItem = this._column[key];
      columnSqlList.push(key);
      columnSqlList.push('' + columnItem.type);
      if (columnItem.allowNull !== undefined && !columnItem.allowNull) {
        columnSqlList.push('NOT NULL');
      }
      if (columnItem.defaultExpr) {
        if (columnItem.type._name === 'VARCHAR') {
          columnSqlList.push(`DEFAULT '${columnItem.defaultExpr}'`);
        } else {
          columnSqlList.push(`DEFAULT ${columnItem.defaultExpr}`);
        }
      }
      if (columnItem.autoIncrement) {
        columnSqlList.push('AUTO_INCREMENT');
      }
      if (columnItem.unique) {
        columnSqlList.push('UNIQUE');
      }
      if (columnItem.comment) {
        columnSqlList.push(`COMMENT '${columnItem.comment}'`);
      }
      /* 定义主体 */
      contentList.push(columnSqlList.join(' '));
      if (columnItem.primaryKey) {
        pkList.push(key);
      }
    }
    if (pkList.length > 0) {
      contentList.push(`PRIMARY KEY (${pkList.join(',')})`);
    }
    const headerSql = `CREATE TABLE ${force ? '' : 'IF NOT EXISTS'} ${this._table} (`;
    const contentSql = wrap ? contentList.join(',\n') : contentList.join(',');
    const footerSql = `);`;
    const sqlList: Array<any> = [];
    sqlList.push(headerSql);
    sqlList.push(contentSql);
    sqlList.push(footerSql);
    return wrap ? sqlList.join('\n') : sqlList.join('');
  }

  getDropTableSql(opt = { force: false }) {
    const { force } = opt;
    const contentSql = `DROP TABLE ${force ? '' : 'IF EXISTS'} ${this._table};`;
    const sqlList: Array<any> = [];
    sqlList.push(contentSql);
    return sqlList.join('');
  }

  sql() {
    return SQLObject.toQsv(this._sqlObject);
  }

  selectOne(fields = ['*']) {
    this.select(fields).pageNum(1).pageSize(1);
    return this;
  }

  select(fields = ['*']) {
    this.resetSqlObject();
    this._sqlObject.query = 'SELECT';
    this._sqlObject.tables.push(this._table);
    const isAll = fields.indexOf('*') !== -1;
    let fieldList: Array<any> = [];
    if (isAll) {
      const columnList = SQLObject.toColumnList(this._column, this._table);
      fieldList = [...columnList];
      if (this._ref && this._ref.length > 0) {
        for (const refItem of this._ref) {
          this._sqlObject.tables.push(refItem.table);
          if (this._sqlObject.where && this._sqlObject.where.length > 0) {
            this._sqlObject.where.push(`AND ${refItem.where}`);
          } else {
            this._sqlObject.where.push(refItem.where);
          }
          const dyColumnList = SQLObject.toColumnList(refItem.column, refItem.table);
          fieldList = [...fieldList, ...dyColumnList];
        }
      }
    } else {
      fieldList = fields;
    }
    this._sqlObject.fields = fieldList;
    return this;
  }

  addCond(cond = {}, rules = {}, link = 'AND') {
    let sqlStr = '';
    const finalRules = Object.assign({}, this._rules, rules);
    for (const condkey in cond) {
      const hasWhere = this._sqlObject.where && this._sqlObject.where.length > 0;
      const condVal = cond[condkey];
      if (condkey === 'pageNum') {
        this.pageNum(condVal);
        continue;
      }
      if (condkey === 'pageSize') {
        this.pageSize(condVal);
        continue;
      }
      const ruleItem = finalRules[condkey];
      if (ruleItem) {
        if (ruleItem.isPageNum) {
          this.pageNum(condVal);
        } else if (ruleItem.isPageSize) {
          this.pageSize(condVal);
        } else {
          sqlStr = this._createExpr(condkey, condVal, ruleItem);
          if (sqlStr) {
            this._sqlObject.where.push(`${hasWhere ? link + ' ' : ''}${sqlStr}`);
          }
        }
      } else {
        sqlStr = this._createExpr(condkey, condVal, ruleItem);
        if (sqlStr) {
          this._sqlObject.where.push(`${hasWhere ? link + ' ' : ''}${sqlStr}`);
        }
      }
    }
    return this;
  }

  pageNum(val) {
    const pageNum = Number(val);
    if (!isNaN(pageNum)) {
      this._sqlObject.options.pageNum = pageNum;
    } else {
      this._sqlObject.options.pageNum = null;
    }
    return this;
  }

  pageSize(val) {
    const pageSize = Number(val);
    if (!isNaN(pageSize)) {
      this._sqlObject.options.pageSize = pageSize;
    } else {
      this._sqlObject.options.pageSize = null;
    }
    return this;
  }

  _createExpr(key, value, rule: { fn?: Function; op?: any; filterNull?: any; filterNullExpr?: any } = {}) {
    let fn: Function | null | undefined = rule.fn;
    if (rule.fn) {
      fn = rule.fn;
    } else {
      /* fixed string 拼接错误问题 */
      if (typeof value === 'string') {
        fn = (val) => `${key} ${rule.op ? rule.op : '='} '${value}'`;
      } else {
        fn = (val) => `${key} ${rule.op ? rule.op : '='} ${value}`;
      }
    }
    if (rule.filterNull && !value) {
      return rule.filterNullExpr || '';
    } else {
      return fn(key, value);
    }
  }

  create(obj = {}, rules = {}) {
    this.resetSqlObject();
    const finalRules = Object.assign({}, this._updateRules, rules);
    this._sqlObject.query = 'INSERT';
    this._sqlObject.tables.push(this._table);
    for (const key in obj) {
      const value = obj[key];
      const ruleItem = finalRules[key];
      if (ruleItem) {
        if (ruleItem.filterNull && value) {
          this._sqlObject.fields.push(key);
          this._sqlObject.data.push(typeof value === 'string' ? `'${value}'` : `${value}`);
        }
      } else {
        this._sqlObject.fields.push(key);
        this._sqlObject.data.push(typeof value === 'string' ? `'${value}'` : `${value}`);
      }
    }
    return this;
  }

  update(obj = {}, rules = {}) {
    this.resetSqlObject();
    const finalRules = Object.assign({}, this._updateRules, rules);
    this._sqlObject.query = 'UPDATE';
    this._sqlObject.tables.push(this._table);
    for (const key in obj) {
      const value = obj[key];
      const ruleItem = finalRules[key];
      if (ruleItem) {
        if (ruleItem.filterNull && value) {
          this._sqlObject.fields.push(key);
          this._sqlObject.data.push(value);
        }
      } else {
        this._sqlObject.fields.push(key);
        this._sqlObject.data.push(value);
      }
    }
    return this;
  }

  remove() {
    this.resetSqlObject();
    this._sqlObject.query = 'DELETE';
    this._sqlObject.tables.push(this._table);
    return this;
  }

  softRemove(obj = {}, rules = {}) {
    this.resetSqlObject();
    this._sqlObject.query = 'UPDATE';
    this._sqlObject.tables.push(this._table);
    for (const key in obj) {
      const value = obj[key];
      this._sqlObject.fields.push(key);
      this._sqlObject.data.push(value);
    }
    return this;
  }

  count() {
    this.resetSqlObject();
    this._sqlObject.query = 'SELECT';
    this._sqlObject.tables.push(this._table);
    if (this._ref && this._ref.length > 0) {
      for (const refItem of this._ref) {
        this._sqlObject.tables.push(refItem.table);
        if (this._sqlObject.where && this._sqlObject.where.length > 0) {
          this._sqlObject.where.push(`AND ${refItem.where}`);
        } else {
          this._sqlObject.where.push(refItem.where);
        }
      }
    }
    this._sqlObject.fields = ['COUNT(*) AS total'];
    return this;
  }

  valueOf() {
    return this._table;
  }
}

/*
const User = new SQLModel({
  table: 'user',
  column: {
    id: {
      type: new SQLDataType.INTEGER(),
      allowNull: false,
      autoIncrement: true,
      unique: true,
      primaryKey: true
    },
    dep_id: {
      type: new SQLDataType.INTEGER(),
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: new SQLDataType.VARCHAR(50),
      allowNull: false
    }
  },
  ref: [
    {
      table: 'department',
      where: 'department.id = user.dep_id',
      column: {}
    }
  ]
})

console.log(
  User.select(['*'])
    .addCond(
      {
        id: 10001,
        name: 'ABC',
        createAt: formatDate(new Date(), 'YYYY/MM/DD HH:mm:ss'),
        updateAt: 'NULL'
      },
      {
        id: {
          filterNull: true,
          filterNullExpr: '1=1'
        },
        name: {
          fn: (key, val) => `${key} LIKE %${val}%`
        },
        createAt: {
          fn: (key, val) => {
            return `(${key} >= ${formatDate(val, 'YYYY/MM/DD 00:00:00')} AND ${key} <= ${formatDate(
              val,
              'YYYY/MM/DD 23:59:59'
            )} )`
          }
        },
        updateAt: {
          op: 'IS',
          filterNull: false,
          filterNullExpr: '1=1'
        }
      }
    )
    .sql()
)

console.log(
  User.select(['*'])
    .addCond(
      {
        id: 10001,
        name: 'ABC'
      },
      {
        id: {
          filterNull: true,
          filterNullExpr: '1=1'
        },
        name: {
          fn: (key, val) => `${key} LIKE %${val}%`
        }
      }
    )
    .pageNum(4)
    .pageSize(10)
    .sql()
)

console.log(
  User.selectOne(['*'])
    .addCond(
      {
        id: 10001,
        name: 'ABC'
      },
      {
        id: {
          filterNull: true,
          filterNullExpr: '1=1'
        },
        name: {
          fn: (key, val) => `${key} LIKE %${val}%`
        }
      }
    )
    .sql()
)

console.log(
  User.create(
    {
      id: 10001,
      name: 'ABC',
      createAt: formatDate(new Date(), 'YYYY/MM/DD HH:mm:ss'),
      updateAt: 'NULL'
    },
    {}
  ).sql()
)

console.log(
  User.update(
    {
      id: 10001,
      name: 'ABC',
      createAt: formatDate(new Date(), 'YYYY/MM/DD HH:mm:ss'),
      updateAt: 'NULL'
    },
    {}
  )
    .addCond(
      {
        id: 10001
      },
      {
        id: {
          filterNull: true,
          filterNullExpr: '1=1'
        }
      }
    )
    .sql()
)

console.log(
  User.remove()
    .addCond(
      {
        id: 10001
      },
      {
        id: {
          filterNull: true,
          filterNullExpr: '1=1'
        }
      }
    )
    .sql()
)

console.log(
  User.softRemove({
    enable: -1
  })
    .addCond(
      {
        id: 10001
      },
      {
        id: {
          filterNull: true,
          filterNullExpr: '1=1'
        }
      }
    )
    .sql()
)

console.log(
  User.count()
    .addCond(
      {
        id: 10001
      },
      {
        id: {
          filterNull: true,
          filterNullExpr: '1=1'
        }
      }
    )
    .sql()
)

console.log(User.getCreateTableSql())
console.log(User.getDropTableSql())
*/
// LIMIT (pageNo - 1) * pageSize, pageSize;
// LIMIT pageSize OFFSET (pageNo - 1) * pageSize;
