import mysql from 'mysql'
// return mysql.format(sql, params);

const getSqlModel = function () {
  return {
    type: '',
    query: [],
    table: [],
    columns: [],
    values: [],
    wheres: [],
    joins: [], // { type: 'LEFT JOIN', ref: '', where: '' }
    // unions: [],
    orders: [],
    raws: [],
    end: ';',
    bindings: []
  }
}

const getQsvModel = function () {
  return {
    query: '',
    sql: '',
    bindings: []
  }
}

const toQsv = function (model) {
  const type = model.type.toUpperCase()
  const sql: Array<String> = []
  const hasWhere = !!(model.wheres && model.wheres.length > 0)
  const bindings: Array<any> = model.bindings || []
  const whereSql: Array<string> = []
  switch (model.type) {
    case 'CREATE':
      sql.push(model.query.join(' '))
      sql.push('(' + model.columns.join(', ') + ')')
      break
    case 'DROP':
      sql.push(model.query.join(' '))
      break
    case 'SELECT':
      sql.push(model.query.join(' '))
      sql.push(model.columns.join(', '))
      sql.push('FROM ' + model.table.join(', '))
      if (model.joins.length > 0) {
        sql.push(model.joins.join(' '))
      }
      for (const item of model.wheres) {
        if (whereSql.length === 0) {
          whereSql.push(`WHERE ${item.sql}`)
        } else {
          whereSql.push(`${item.type} ${item.sql}`)
        }
        bindings.push(...item.bindings)
      }
      sql.push(whereSql.join(' '))
      if (model.orders.length > 0) {
        sql.push('ORDER BY ' + model.orders.join(', '))
      }
      if (model.raws.length > 0) {
        sql.push(model.raws.join(' '))
      }
      break
    case 'INSERT':
      sql.push(model.query.join(' '))
      sql.push('(' + model.columns.join(', ') + ')')
      sql.push('VALUES (' + model.values.join(', ') + ')')
      break
    case 'UPDATE':
      sql.push(model.query.join(' '))
      sql.push('SET ' + model.columns.join(', '))
      for (const item of model.wheres) {
        if (whereSql.length === 0) {
          whereSql.push(`WHERE ${item.sql}`)
        } else {
          whereSql.push(`${item.type} ${item.sql}`)
        }
        bindings.push(...item.bindings)
      }
      sql.push(whereSql.join(' '))
      if (model.orders.length > 0) {
        sql.push('ORDER BY ' + model.orders.join(', '))
      }
      if (model.raws.length > 0) {
        sql.push(model.raws.join(' '))
      }
      break
    case 'DELETE':
      sql.push(model.query.join(' '))
      for (const item of model.wheres) {
        if (whereSql.length === 0) {
          whereSql.push(`WHERE ${item.sql}`)
        } else {
          whereSql.push(`${item.type} ${item.sql}`)
        }
        bindings.push(...item.bindings)
      }
      sql.push(whereSql.join(' '))
      if (model.orders.length > 0) {
        sql.push('ORDER BY ' + model.orders.join(', '))
      }
      if (model.raws.length > 0) {
        sql.push(model.raws.join(' '))
      }
      break
    default:
      break
  }
  return {
    type: type,
    sql: sql.join(' ') + model.end,
    bindings: bindings
  }
}

const SQLObject = {
  getSqlModel,
  getQsvModel,
  toQsv
}

export { SQLObject }
