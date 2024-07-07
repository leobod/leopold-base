import { SQLObject } from './SQLObject'

class SQLModel {
  _table: any
  _column: {
    [key: string]: {
      type: {
        [key: string]: any
      }
      allowNull?: any
      autoIncrement?: any
      unique?: any
      primaryKey?: any
      defaultExpr?: any
      comment?: any
      rawExpr?: any
      // 有ref 及为关联字段，或者别名字段
      ref?: any
      ref_table?: any
      ref_alias?: any
      origin?: any
      operate: any
    }
  }
  _ref: any
  _filter: any
  _sqlObject: any

  constructor(options) {
    if (!options.table) throw new Error('table required')
    this._table = options.table || null
    this._column = options.column || {}
    this._ref = options.ref || {}
    this._filter = options.filter || {}
    this._sqlObject = SQLObject.getSqlModel()
  }
  /**
   * 重置SqlObject
   */
  resetSqlObject() {
    this._sqlObject = SQLObject.getSqlModel()
  }
  /**
   * 建表
   * @param force
   */
  create(force = false) {
    this.resetSqlObject()
    // 记录类型
    this._sqlObject.type = 'CREATE'
    // 定义query
    this._sqlObject.query.push('CREATE')
    this._sqlObject.query.push('TABLE')
    if (!force) {
      this._sqlObject.query.push('IF NOT EXISTS')
    }
    this._sqlObject.query.push(`\`${this._table}\``)
    this._sqlObject.end = `;`
    // 定义columns
    const pkList: Array<any> = []
    for (const key in this._column) {
      const columnSqlList: Array<any> = []
      const item = this._column[key]
      if (!item.ref) {
        columnSqlList.push(`\`${key}\``)
        columnSqlList.push(item.type.toDialect())
        if (item.allowNull !== undefined && !item.allowNull) {
          columnSqlList.push('NOT NULL')
        }
        if (item.defaultExpr) {
          if (item.type._name === 'VARCHAR') {
            columnSqlList.push(`DEFAULT '${item.defaultExpr}'`)
          } else {
            columnSqlList.push(`DEFAULT ${item.defaultExpr}`)
          }
        }
        if (item.rawExpr) {
          columnSqlList.push(item.rawExpr)
        }
        if (item.autoIncrement) {
          columnSqlList.push('AUTO_INCREMENT')
        }
        if (item.unique) {
          columnSqlList.push('UNIQUE')
        }
        if (item.comment) {
          columnSqlList.push(`COMMENT '${item.comment}'`)
        }
        this._sqlObject.columns.push(columnSqlList.join(' '))
        if (item.primaryKey) {
          pkList.push(`\`${key}\``)
        }
      }
    }
    if (pkList.length > 0) {
      this._sqlObject.columns.push(`PRIMARY KEY (${pkList.join(',')})`)
    }
    return this
  }

  drop(force = false) {
    this.resetSqlObject()
    this._sqlObject.type = 'DROP'
    this._sqlObject.query.push('DROP')
    this._sqlObject.query.push('TABLE')
    if (!force) {
      this._sqlObject.query.push('IF EXISTS')
    }
    this._sqlObject.query.push(`\`${this._table}\``)
    this._sqlObject.end = ';'
    return this
  }

  select(fields: Array<string> | string = '*') {
    if (!fields) throw new Error('fields required')
    this.resetSqlObject()
    this._sqlObject.type = 'SELECT'
    this._sqlObject.query.push('SELECT')
    this._sqlObject.end = ';'
    let fieldKeyList: Array<string> = []
    if (fields instanceof Array) {
      if (fields.indexOf('*') !== -1) fieldKeyList = Object.keys(this._column)
      else fieldKeyList = [...fields]
    } else {
      if (fields === '*') fieldKeyList = Object.keys(this._column)
      else fieldKeyList = [fields]
    }
    const tableKeyList: Array<string> = [`${this._table}`]
    const joinKeyList: Array<any> = []
    for (const key of fieldKeyList) {
      const columnItem = this._column[key]
      if (columnItem) {
        const ref_alias = columnItem.ref_alias
          ? columnItem.ref_alias
          : columnItem.ref_table
        const columnItemSql: Array<string> = []
        if (columnItem.ref && columnItem.ref_table && columnItem.origin) {
          if (joinKeyList.indexOf(`${columnItem.ref}`) === -1) {
            joinKeyList.push({
              ref_key: `${columnItem.ref}`,
              ref_table: `${columnItem.ref_table}`,
              ref_alias: `${ref_alias}`
            })
          }
          columnItemSql.push(`${ref_alias}.${columnItem.origin}`)
        } else {
          columnItemSql.push(`${this._table}.${key}`)
        }
        columnItemSql.push(`AS`)
        columnItemSql.push(`\`${key}\``)
        this._sqlObject.columns.push(columnItemSql.join(' '))
      }
    }
    for (let i = 0; i < tableKeyList.length; ++i) {
      const tableKey = tableKeyList[i]
      tableKeyList[i] = `\`${tableKey}\``
    }
    for (let i = 0; i < joinKeyList.length; ++i) {
      const refItem = joinKeyList[i]
      const tableRefWhere = this._ref[refItem.ref_key]
      if (tableRefWhere) {
        this._sqlObject.joins.push(
          `${tableRefWhere.JOIN} \`${refItem.ref_table}\` as \`${refItem.ref_alias}\` ON ${tableRefWhere.ON}`
        )
      }
    }
    this._sqlObject.table = tableKeyList
    return this
  }

  selectRaw(sql) {
    if (sql) {
      this._sqlObject.columns.push(sql)
    }
    return this
  }

  selectOne(fields: Array<string> | string = '*') {
    this.select(fields).page(1, 1)
    return this
  }

  getColumnInfo(key) {
    let columnKey = ''
    let columnTable = ''
    const columnItem = this._column[key]
    if (columnItem) {
      if (columnItem.ref && columnItem.origin) {
        columnKey = `${columnItem.ref}.${columnItem.origin}`
        columnTable = `${columnItem.ref}`
      } else {
        columnKey = `${this._table}.${key}`
        columnTable = `${this._table}`
      }
    }
    return {
      key: columnKey,
      table: columnTable
    }
  }

  where(obj = {}) {
    for (const key in obj) {
      const columnItem = this._column[key]
      const columnInfo = this.getColumnInfo(key)
      if (columnInfo.table) {
        // 处理当前字段where
        let columnOperate = columnItem.operate || '='
        if (columnOperate instanceof Function) {
          const bindings = []
          this.andRawWhere(columnOperate(columnInfo.key, obj[key], bindings), bindings)
        } else {
          this.andWhere(columnInfo.key, obj[key], columnOperate)
        }
      }
    }
    return this
  }

  andWhere(key, value, operate = '=') {
    const exprObj = this.exprWhere(key, value, operate)
    const whereItem = this._sqlObject.wheres
    whereItem.push({
      group: null,
      type: 'AND',
      sql: exprObj.sql,
      bindings: exprObj.bindings
    })
    return this
  }

  andRawWhere(sql, bindings = []) {
    const whereItem = this._sqlObject.wheres
    whereItem.push({
      group: null,
      type: 'AND',
      sql: sql ? sql : '',
      bindings: bindings
    })
    return this
  }

  exprWhere(key, value, operate = '=') {
    const exprObj: any = {
      sql: '',
      bindings: []
    }
    switch (operate) {
      case '=':
      case '<':
      case '>':
      case '<=':
      case '>=':
      case '<>':
        exprObj.sql = `${key} ${operate} ?`
        exprObj.bindings.push(value)
        break
      case 'LIKE':
      case 'NOT LIKE':
        exprObj.sql = `${key} ${operate} ?`
        exprObj.bindings.push(`%${value}%`)
        break
      case 'IN':
      case 'NOT IN':
        exprObj.sql = `${key} ${operate} (?)`
        exprObj.bindings = [value]
        break
      case 'IS NULL':
      case 'IS NOT NULL':
        exprObj.sql = `${key} ${operate}`
        break
      case 'BETWEEN':
        exprObj.sql = `${key} ${operate} ? AND ?`
        exprObj.bindings = value instanceof Array ? [...value] : [value, value]
        break
    }
    return exprObj
  }

  page(pageNum, pageSize) {
    const hasPageSize = typeof pageSize === 'number'
    const hasPageNum = typeof pageNum === 'number'
    if (hasPageNum && hasPageSize) {
      const offsetVal = (Number(pageNum) - 1) * Number(pageSize)
      this._sqlObject.raws.push(`LIMIT ${pageSize} OFFSET ${offsetVal}`)
    } else if (hasPageSize) {
      this._sqlObject.raws.push(`LIMIT ${pageSize}`)
    } else if (hasPageNum) {
      this._sqlObject.raws.push(`OFFSET ${pageNum}`)
    }
    return this
  }

  orderBy(key, sort = 'ASC') {
    this._sqlObject.orders.push(`${key} ${sort}`)
    return this
  }

  insert(obj = {}) {
    this.resetSqlObject()
    this._sqlObject.type = 'INSERT'
    this._sqlObject.query.push('INSERT')
    this._sqlObject.query.push('INTO')
    this._sqlObject.query.push(`\`${this._table}\``)
    this._sqlObject.end = ';'

    const columnSQl: Array<string> = []
    const valueSQl: Array<string> = []
    const bindingsSql: Array<string> = []
    for (const key in obj) {
      columnSQl.push(`\`${key}\``)
      valueSQl.push('?')
      bindingsSql.push(obj[key])
    }
    this._sqlObject.columns = columnSQl
    this._sqlObject.values = valueSQl
    this._sqlObject.bindings = bindingsSql
    return this
  }

  update(obj = {}) {
    this.resetSqlObject()
    this._sqlObject.type = 'UPDATE'
    this._sqlObject.query.push('UPDATE')
    this._sqlObject.query.push(`\`${this._table}\``)
    this._sqlObject.end = ';'

    const columnSQl: Array<string> = []
    const bindingsSql: Array<string> = []
    for (const key in obj) {
      columnSQl.push(`\`${key}\` = ?`)
      bindingsSql.push(obj[key])
    }
    this._sqlObject.columns = columnSQl
    this._sqlObject.bindings = bindingsSql
    return this
  }

  softRemove(obj = {}) {
    this.update(obj)
    return this
  }

  remove() {
    this.resetSqlObject()
    this._sqlObject.type = 'DELETE'
    this._sqlObject.query.push('DELETE')
    this._sqlObject.query.push('FROM')
    this._sqlObject.query.push(`\`${this._table}\``)
    this._sqlObject.end = ';'
    return this
  }

  count() {
    this.resetSqlObject()
    this._sqlObject.type = 'SELECT'
    this._sqlObject.query.push('SELECT')
    this._sqlObject.columns.push('COUNT(*) AS total')
    this._sqlObject.table.push(`\`${this._table}\``)
    this._sqlObject.end = ';'
    return this
  }

  toSql() {
    return SQLObject.toQsv(this._sqlObject)
  }
}

export { SQLModel }
