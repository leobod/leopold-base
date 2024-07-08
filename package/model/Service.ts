import { Context } from 'koa'
import { SQLModel } from './SQLModel'
import { filterDbResult } from '../utils/filter'
import { getRequiredRules, validateRules } from '../utils/validator'
import { formatDate } from '../utils/dayjs'
import {
  formatKeyCase,
  formatObjCase,
  reverseFormatKeyCase,
  reverseFormatObjCase
} from '../utils/namecase'

export class ServiceDef {
  constructor() {}
}

export class Service extends ServiceDef {
  model: SQLModel
  format: string
  error_custom: boolean
  error_message: string
  page_num_key: string
  page_size_key: string
  order_by_key: string
  update_time_modify: boolean
  update_time_key: string
  soft_remove_key: string
  soft_remove_val: any
  pk: string

  constructor(
    model: SQLModel,
    opts = {
      format: 'Origin', // 可选 Origin, Camel2Line, Line2Camel
      error_custom: true,
      error_message: 'Unknown Error',
      page_num_key: 'page_num',
      page_size_key: 'page_size',
      order_by_key: '',
      update_time_modify: true,
      update_time_key: 'update_at',
      soft_remove_key: 'state',
      soft_remove_val: 0,
      pk: 'code'
    }
  ) {
    super()
    this.model = model
    const finalOpts = Object.assign(
      {},
      {
        format: 'Origin', // 可选 Origin, Camel2Line, Line2Camel
        error_custom: true,
        error_message: 'Unknown Error',
        page_num_key: 'page_num',
        page_size_key: 'page_size',
        update_time_modify: true,
        update_time_key: 'update_at',
        soft_remove_key: 'state',
        soft_remove_val: 0,
        pk: 'code'
      },
      opts
    )
    this.format = finalOpts.format || 'Origin'
    this.error_custom = finalOpts.error_custom
    this.error_message = finalOpts.error_message
    this.update_time_modify = finalOpts.update_time_modify
    this.soft_remove_val = finalOpts.soft_remove_val
    this.page_num_key = formatKeyCase(finalOpts.page_num_key, this.format)
    this.page_size_key = formatKeyCase(finalOpts.page_size_key, this.format)
    this.order_by_key = finalOpts.order_by_key || ''
    this.update_time_key = formatKeyCase(finalOpts.update_time_key, this.format)
    this.soft_remove_key = formatKeyCase(finalOpts.soft_remove_key, this.format)
    this.pk = formatKeyCase(finalOpts.pk, this.format)
  }

  /**
   * 创建表格SQL
   * @param params
   * @param opts
   * @returns {SQLModel}
   */
  getCreateSQLModel(params = {}, opts = {}): SQLModel {
    const { model } = this
    return model.create()
  }

  /**
   * 创建表格
   * @param ctx {Context}
   * @param params
   * @param opts
   * @returns {Promise<*>}
   */
  async create(ctx: Context, params = {}, opts = {}): Promise<any> {
    const sql = this.getCreateSQLModel().toSql()
    try {
      return await ctx.db.mysql.query(sql.sql, sql.bindings)
    } catch (e) {
      if (this.error_custom) {
        throw new Error(this.error_message)
      } else {
        throw e
      }
    }
  }

  /**
   * 记录总数SQL
   * @param params
   * @param opts
   * @returns {SQLModel}
   */
  getCountSQLModel(params = {}, opts = {}): SQLModel {
    const { model, page_num_key, page_size_key } = this
    let pageCond = Object.assign({}, params)
    delete pageCond[page_num_key]
    delete pageCond[page_size_key]
    return model.count().where(reverseFormatObjCase(params, this.format))
  }

  /**
   * 记录总数
   * @param ctx {Context}
   * @param params
   * @param opts
   * @returns {Promise<*>}
   */
  async count(ctx: Context, params = {}, opts = {}): Promise<any> {
    const sql = this.getCountSQLModel().toSql()
    const res = await ctx.db.mysql.query(sql.sql, sql.bindings)
    if (res && res.length > 0) {
      return res[0].total
    } else {
      return null
    }
  }

  /**
   * 记录列表SQL
   * @param params
   * @param opts
   * @returns {SQLModel}
   */
  getListSQLModel(
    params = {},
    opts = {
      order_by_key: '',
      table_column: ['*']
    }
  ): SQLModel {
    const { model, page_num_key, page_size_key } = this
    const page_num = params[page_num_key]
    const page_size = params[page_size_key]
    let listParams = Object.assign({}, params)
    delete listParams[page_num_key]
    delete listParams[page_size_key]
    const order_by_key = opts.order_by_key ? opts.order_by_key : this.order_by_key
    const table_column = opts.table_column || ['*']
    if (order_by_key) {
      return model
        .select(table_column)
        .where(reverseFormatObjCase(listParams, this.format))
        .page(page_num, page_size)
        .orderBy(order_by_key)
    } else {
      return model
        .select(table_column)
        .where(reverseFormatObjCase(listParams, this.format))
        .page(page_num, page_size)
    }
  }

  /**
   * 记录列表
   * @param ctx {Context}
   * @param params
   * @param opts
   * @returns {Promise<*>}
   */
  async list(
    ctx: Context,
    params = {},
    opts = {
      order_by_key: '',
      table_column: ['*']
    }
  ): Promise<any> {
    const { model, page_size_key } = this
    const page_size = params[page_size_key]
    const countSql = this.getCountSQLModel(params, opts).toSql()
    const listSql = this.getListSQLModel(params, opts).toSql()
    try {
      let countResult = null
      const countRes = await ctx.db.mysql.query(countSql.sql, countSql.bindings)
      if (countRes && countRes.length > 0) {
        countResult = countRes[0].total
      } else {
        countResult = null
      }
      let total_page = 1
      let total_size = countResult
      if (total_size && page_size && page_size > 0) {
        total_page = Math.ceil(total_size / page_size)
      }
      const res = { list: null, total_page, total_size }
      const dbResult = await ctx.db.mysql.query(listSql.sql, listSql.bindings)
      const userFilter = model._filter || {}
      res.list = filterDbResult(dbResult, userFilter)
      return formatObjCase(res, this.format)
    } catch (e) {
      if (this.error_custom) {
        throw new Error(this.error_message)
      } else {
        throw e
      }
    }
  }

  /**
   * 查询单个记录SQL
   * @param params
   * @param opts
   * @returns {SQLModel}
   */
  getListOneSQLModel(
    params = {},
    opts = {
      order_by_key: '',
      table_column: ['*']
    }
  ): SQLModel {
    const { model } = this
    const order_by_key = opts.order_by_key ? opts.order_by_key : this.order_by_key
    const table_column = opts.table_column || ['*']
    if (order_by_key) {
      return model
        .select(table_column)
        .where(reverseFormatObjCase(params, this.format))
        .orderBy(order_by_key)
    } else {
      return model.select(table_column).where(params)
    }
  }

  /**
   * 查询单个记录
   * @param ctx {Context}
   * @param params
   * @param opts
   * @returns {Promise<*>}
   */
  async listOne(
    ctx: Context,
    params = {},
    opts = {
      order_by_key: '',
      table_column: ['*']
    }
  ): Promise<any> {
    const { model } = this
    let sql = this.getListOneSQLModel(params, opts).toSql()
    try {
      const dbResult = await ctx.db.mysql.query(sql.sql, sql.bindings)
      const userFilter = model._filter || {}
      const filterResult = filterDbResult(dbResult, userFilter)
      if (filterResult && filterResult.length > 0) {
        return formatObjCase(filterResult[0], this.format)
      } else {
        return null
      }
    } catch (e) {
      if (this.error_custom) {
        throw new Error(this.error_message)
      } else {
        throw e
      }
    }
  }

  /**
   * 新建SQL
   * @param params
   * @param opts
   * @returns {SQLModel}
   */
  getAddSQLModel(params = {}, opts = {}): SQLModel {
    const { model } = this
    const saveParams = reverseFormatObjCase(params, this.format)
    const rules = getRequiredRules(model)
    const [err, errMsg] = validateRules(saveParams, rules)
    if (!err) {
      /* FIXED 不存在的字段会自动过滤 */
      const _column: Array<any> = []
      // Object.keys(model._column);
      for (const defKey in model._column) {
        if (!model._column[defKey].ref) {
          _column.push(defKey)
        }
      }
      const modelObj = {}
      for (const key in saveParams) {
        if (_column.indexOf(key) !== -1) {
          modelObj[key] = saveParams[key]
        }
      }
      return model.insert(modelObj)
    } else {
      throw new Error(errMsg as string)
    }
  }

  /**
   * 新建
   * @param ctx {Context}
   * @param params
   * @param opts
   * @returns {Promise<*>}
   */
  async add(ctx: Context, params = {}, opts = {}): Promise<any> {
    const sql = this.getAddSQLModel(params, opts).toSql()
    try {
      const dbResult = await ctx.db.mysql.query(sql.sql, sql.bindings)
      /* OkPacket { fieldCount: 0, affectedRows: 1, insertId: 0, serverStatus: 2,
                    warningCount: 0, message: '', protocol41: true, changedRows: 0 } */
      if (dbResult && dbResult.affectedRows > 0) {
        return 'success'
      } else {
        return null
      }
    } catch (e) {
      if (this.error_custom) {
        throw new Error(this.error_message)
      } else {
        throw e
      }
    }
  }

  /**
   * 编辑SQLModel
   * @param params
   * @param opts
   * @returns {SQLModel}
   */
  getEditSQLModel(params = {}, opts = {}): SQLModel {
    const { model, pk, update_time_modify, update_time_key } = this
    let updateParams = params
    const condParams = { [pk]: updateParams[pk] }
    if (update_time_modify && update_time_key && !updateParams[update_time_key]) {
      updateParams[update_time_key] = formatDate(new Date(), 'YYYY/MM/DD HH:mm:ss')
    }
    updateParams = reverseFormatObjCase(updateParams, this.format)
    /* FIXED 不存在的字段会自动过滤 */
    const _column: Array<any> = []
    // Object.keys(model._column);
    for (const defKey in model._column) {
      if (!model._column[defKey].ref) {
        _column.push(defKey)
      }
    }
    const modelObj = {}
    for (const key in updateParams) {
      if (_column.indexOf(key) !== -1) {
        modelObj[key] = updateParams[key]
      }
    }
    delete modelObj[pk]
    return model.update(modelObj).where(reverseFormatObjCase(condParams, this.format))
  }

  /**
   * 更新
   * @param ctx {Context}
   * @param params
   * @param opts
   * @returns {Promise<*>}
   */
  async edit(ctx: Context, params = {}, opts = {}): Promise<any> {
    const sql = this.getEditSQLModel(params, opts).toSql()
    try {
      const dbResult = await ctx.db.mysql.query(sql.sql, sql.bindings)
      /* OkPacket { fieldCount: 0, affectedRows: 1, insertId: 0, serverStatus: 2,
                  warningCount: 0, message: '', protocol41: true, changedRows: 1 } */
      if (dbResult) {
        return 'success'
      } else {
        return null
      }
    } catch (e) {
      if (this.error_custom) {
        throw new Error(this.error_message)
      } else {
        throw e
      }
    }
  }

  /**
   * 软移除SQLModel
   * @param params
   * @param opts
   * @returns {SQLModel}
   */
  getSoftRemoveSQLModel(params = {}, opts = {}): SQLModel {
    const {
      pk,
      update_time_modify,
      update_time_key,
      soft_remove_key,
      soft_remove_val = 0
    } = this
    const { model } = this
    const updateParams = params
    const condParams = { [pk]: params[pk] }
    if (update_time_modify && update_time_key && !updateParams[update_time_key]) {
      updateParams[update_time_key] = formatDate(new Date(), 'YYYY/MM/DD HH:mm:ss')
    }
    const modelObj = { [soft_remove_key]: soft_remove_val }
    return model
      .update(reverseFormatObjCase(modelObj, this.format))
      .where(reverseFormatObjCase(condParams, this.format))
  }

  /**
   * 软移除
   * @param ctx {Context}
   * @param params
   * @param opts
   * @returns {Promise<*>}
   */
  async softRemove(ctx: Context, params = {}, opts = {}): Promise<any> {
    const sql = this.getSoftRemoveSQLModel(params, opts).toSql()
    try {
      const dbResult = await ctx.db.mysql.query(sql.sql, sql.bindings)
      /* OkPacket { fieldCount: 0, affectedRows: 1, insertId: 0, serverStatus: 2,
                warningCount: 0, message: '', protocol41: true, changedRows: 1 } */
      if (dbResult) {
        return 'success'
      } else {
        return null
      }
    } catch (e) {
      if (this.error_custom) {
        throw new Error(this.error_message)
      } else {
        throw e
      }
    }
  }

  /**
   * 移除SQLModel
   * @param params
   * @param opts
   * @returns {SQLModel}
   */
  getRemoveSQLModel(params = {}, opts = {}): SQLModel {
    const { model, pk } = this
    const condParams = { [pk]: params[pk] }
    return model.remove().where(reverseFormatObjCase(condParams, this.format))
  }

  /**
   * 移除
   * @param ctx {Context}
   * @param params
   * @param opts
   * @returns {Promise<*>}
   */
  async remove(ctx: Context, params = {}, opts = {}): Promise<any> {
    const sql = this.getRemoveSQLModel(params, opts).toSql()
    try {
      const dbResult = await ctx.db.mysql.query(sql.sql, sql.bindings)
      if (dbResult) {
        return 'success'
      } else {
        return null
      }
    } catch (e) {
      if (this.error_custom) {
        throw new Error(this.error_message)
      } else {
        throw e
      }
    }
  }
}
