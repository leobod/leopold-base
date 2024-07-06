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
      order_by_has: true,
      order_by_key: 'create_at',
      order_by_val: 'ASC',
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
    this.update_time_key = formatKeyCase(finalOpts.update_time_key, this.format)
    this.soft_remove_key = formatKeyCase(finalOpts.soft_remove_key, this.format)
    this.pk = formatKeyCase(finalOpts.pk, this.format)
  }
  /**
   * 创建表格
   * @param ctx {Context}
   * @param opts
   * @returns {Promise<*>}
   */
  async create(ctx: Context, params = {}, opts = {}): Promise<any> {
    const { model } = this
    const sql = model.create().toSql()
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
   * 记录总数
   * @param ctx {Context}
   * @param params
   * @param opts
   * @returns {Promise<*>}
   */
  async count(ctx: Context, params = {}, opts = {}): Promise<any> {
    const { model } = this
    const sql = model.count().where(reverseFormatObjCase(params, this.format)).toSql()
    const res = await ctx.db.mysql.query(sql.sql, sql.bindings)
    if (res && res.length > 0) {
      return res[0].total
    } else {
      return null
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
    opts = { order_by_has: true, order_by_key: 'create_at', order_by_val: 'ASC' }
  ): Promise<any> {
    const { page_num_key, page_size_key } = this
    const order_by_has = opts.order_by_has
    const order_by_key = formatKeyCase(opts.order_by_key || 'create_at', this.format)
    const order_by_val = formatKeyCase(opts.order_by_val || 'ASC', this.format)
    const { model } = this
    try {
      const page_num = params[page_num_key]
      const page_size = params[page_size_key]
      let pageCond = Object.assign({}, params)
      delete pageCond[page_num_key]
      delete pageCond[page_size_key]
      pageCond = reverseFormatObjCase(pageCond, this.format)
      const countResult = await this.count(ctx, pageCond)
      let total_page = 1
      let total_size = countResult
      if (page_size && page_size > 0) {
        total_page = Math.ceil(total_size / page_size)
      }
      const res = {
        list: null,
        total_page,
        total_size
      }
      let sql: any = { sql: '', bindings: [] }
      if (order_by_has) {
        sql = model
          .select(['*'])
          .where(reverseFormatObjCase(params, this.format))
          .page(page_num, page_size)
          .orderBy(reverseFormatKeyCase(order_by_key, this.format), order_by_val)
          .toSql()
      } else {
        sql = model
          .select(['*'])
          .where(reverseFormatObjCase(params, this.format))
          .page(page_num, page_size)
          .toSql()
      }
      const dbResult = await ctx.db.mysql.query(sql.sql, sql.bindings)
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
   * 查询单个model
   * @param ctx {Context}
   * @param params
   * @param opts
   * @returns {Promise<*>}
   */
  async listOne(
    ctx: Context,
    params = {},
    opts = { order_by_has: true, order_by_key: 'create_at', order_by_val: 'ASC' }
  ): Promise<any> {
    const order_by_has = opts.order_by_has
    const order_by_key = formatKeyCase(opts.order_by_key || 'create_at', this.format)
    const order_by_val = formatKeyCase(opts.order_by_val || 'ASC', this.format)
    const { model } = this
    try {
      let sql: any = { sql: '', bindings: [] }
      if (order_by_has) {
        sql = model
          .select(['*'])
          .where(reverseFormatObjCase(params, this.format))
          .orderBy(reverseFormatKeyCase(order_by_key, this.format), order_by_val)
          .toSql()
      } else {
        sql = model.select(['*']).where(params).toSql()
      }
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
   * 新建
   * @param ctx {Context}
   * @param params
   * @param opts
   * @returns {Promise<*>}
   */
  async add(ctx: Context, params = {}, opts = {}): Promise<any> {
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
      const sql = model.insert(modelObj).toSql()
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
    } else {
      throw new Error(errMsg as string)
    }
  }

  /**
   * 更新
   * @param ctx {Context}
   * @param params
   * @param opts
   * @returns {Promise<*>}
   */
  async edit(ctx: Context, params = {}, opts = {}): Promise<any> {
    const { pk, update_time_modify, update_time_key } = this
    const { model } = this
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
    const sql = model
      .update(modelObj)
      .where(reverseFormatObjCase(condParams, this.format))
      .toSql()
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
   * 软移除
   * @param ctx {Context}
   * @param params
   * @param opts
   * @returns {Promise<*>}
   */
  async softRemove(ctx: Context, params = {}, opts = {}): Promise<any> {
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
    const sql = model
      .update(reverseFormatObjCase(modelObj, this.format))
      .where(reverseFormatObjCase(condParams, this.format))
      .toSql()
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
   * 移除
   * @param ctx {Context}
   * @param params
   * @param opts
   * @returns {Promise<*>}
   */
  async remove(ctx: Context, params = {}, opts = {}): Promise<any> {
    const { pk } = this
    const { model } = this
    const condParams = { [pk]: params[pk] }
    const sql = model
      .remove()
      .where(reverseFormatObjCase(condParams, this.format))
      .toSql()
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
