import { Context } from 'koa';
import { SQLModel } from '../model/SQLModel';
import { filterDbResult } from '../utils/filter';
import { getRequiredRules, validateRules } from '../utils/validator';
import { formatDate } from '../utils/dayjs';

export class Service {
  model: SQLModel;
  constructor(model: SQLModel) {
    this.model = model;
  }
  /**
   * 创建表格
   * @param ctx {Context}
   * @returns {Promise<*>}
   */
  async create(ctx: Context): Promise<any> {
    const { model } = this;
    const sql = model.create().toSql();
    try {
      ctx.body = ctx.result(await ctx.db.mysql.query(sql.sql, sql.bindings));
    } catch (e) {
      throw e;
    }
  }

  /**
   * 记录总数
   * @param ctx {Context}
   * @param params
   * @returns {Promise<*>}
   */
  async count(ctx: Context, params = {}): Promise<any> {
    const { model } = this;
    const sql = model.count().where(params).toSql();
    const res = await ctx.db.mysql.query(sql.sql, sql.bindings);
    if (res && res.length > 0) {
      return res[0].total;
    } else {
      return null;
    }
  }

  /**
   * 记录分页详情
   * @param ctx {Context}
   * @param params
   */
  async page(
    ctx: Context,
    params = {} as {
      page_num?: number;
      page_size?: number;
    }
  ): Promise<any> {
    const { page_num = 1, page_size = 1 } = params;
    const pageCond = Object.assign({}, params);
    delete pageCond.page_num;
    delete pageCond.page_size;
    const countResult = await this.count(ctx, pageCond);
    let total_page = 1;
    let total_size = countResult;
    if (page_size && page_size > 0) {
      total_page = Math.ceil(total_size / page_size);
    }
    return {
      total_page,
      total_size
    };
  }

  /**
   * 记录列表
   * @param ctx {Context}
   * @param params
   * @returns {Promise<*>}
   */
  async list(ctx: Context, params = {}): Promise<any> {
    const { model } = this;
    try {
      const res = await this.page(ctx, params);
      const sql = model.select(['*']).where(params).toSql();
      const dbResult = await ctx.db.mysql.query(sql.sql, sql.bindings);
      const userFilter = model._filter || {};
      res.list = filterDbResult(dbResult, userFilter);
      ctx.body = ctx.result(res);
    } catch (e) {
      throw e;
    }
  }

  /**
   * 查询单个model
   * @param ctx {Context}
   * @param params
   * @returns {Promise<*>}
   */
  async listOne(ctx: Context, params = {}): Promise<any> {
    const { model } = this;
    try {
      const sql = model.select(['*']).where(params).orderBy('create_at', 'DESC').toSql();
      const dbResult = await ctx.db.mysql.query(sql.sql, sql.bindings);
      const userFilter = model._filter || {};
      const filterResult = filterDbResult(dbResult, userFilter);
      if (filterResult && filterResult.length > 0) {
        ctx.body = ctx.result(filterResult[0]);
      } else {
        ctx.body = ctx.result(null);
      }
    } catch (e) {
      throw e;
    }
  }

  /**
   * 新建
   * @param ctx {Context}
   * @param params
   * @returns {Promise<*>}
   */
  async add(ctx: Context, params = {}): Promise<any> {
    const { model } = this;
    const saveParams = params;
    const rules = getRequiredRules(model);
    const [err, errMsg] = validateRules(saveParams, rules);
    if (!err) {
      const sql = model.insert(saveParams).toSql();
      try {
        const dbResult = await ctx.db.mysql.query(sql.sql, sql.bindings);
        /* OkPacket { fieldCount: 0, affectedRows: 1, insertId: 0, serverStatus: 2,
                    warningCount: 0, message: '', protocol41: true, changedRows: 0 } */
        if (dbResult && dbResult.affectedRows > 0) {
          ctx.body = ctx.result('success');
        } else {
          ctx.body = ctx.result('');
        }
      } catch (e) {
        throw e;
      }
    } else {
      throw new Error(errMsg as string);
    }
  }

  /**
   * 更新
   * @param ctx {Context}
   * @param params
   * @returns {Promise<*>}
   */
  async edit(
    ctx: Context,
    params = {},
    opts = {
      update_time_modify: true,
      update_time_key: 'update_at',
      pk: 'code'
    }
  ): Promise<any> {
    const {
      pk = 'code',
      update_time_modify = true,
      update_time_key = 'update_at'
    } = opts;
    const { model } = this;
    const updateParams = params;
    const condParams = { [pk]: updateParams[pk] };
    if (update_time_modify && update_time_key && !updateParams[update_time_key]) {
      updateParams[update_time_key] = formatDate(new Date(), 'YYYY/MM/DD HH:mm:ss');
    }
    const _column = Object.keys(model._column);
    const modelObj = {};
    for (const key in updateParams) {
      if (_column.indexOf(key) !== -1) {
        modelObj[key] = updateParams[key];
      }
    }
    delete modelObj[pk];
    const sql = model.update(modelObj).where(condParams).toSql();
    try {
      const dbResult = await ctx.db.mysql.query(sql.sql, sql.bindings);
      /* OkPacket { fieldCount: 0, affectedRows: 1, insertId: 0, serverStatus: 2,
                  warningCount: 0, message: '', protocol41: true, changedRows: 1 } */
      if (dbResult) {
        ctx.body = ctx.result('success');
      } else {
        ctx.body = ctx.result('');
      }
    } catch (e) {
      throw e;
    }
  }

  /**
   * 软移除
   * @param ctx {Context}
   * @param params
   * @returns {Promise<*>}
   */
  async softRemove(
    ctx: Context,
    params = {},
    opts = {
      update_time_modify: true,
      update_time_key: 'update_at',
      soft_remove_key: 'state',
      soft_remove_val: 0,
      pk: 'code'
    }
  ): Promise<any> {
    const {
      pk = 'code',
      update_time_modify = true,
      update_time_key = 'update_at',
      soft_remove_key = 'state',
      soft_remove_val = 0
    } = opts;
    const { model } = this;
    const updateParams = params;
    const condParams = { [pk]: params[pk] };
    if (update_time_modify && update_time_key && !updateParams[update_time_key]) {
      updateParams[update_time_key] = formatDate(new Date(), 'YYYY/MM/DD HH:mm:ss');
    }
    const modelObj = { [soft_remove_key]: soft_remove_val };
    const sql = model.update(modelObj).where(condParams).toSql();
    try {
      const dbResult = await ctx.db.mysql.query(sql.sql, sql.bindings);
      /* OkPacket { fieldCount: 0, affectedRows: 1, insertId: 0, serverStatus: 2,
                warningCount: 0, message: '', protocol41: true, changedRows: 1 } */
      if (dbResult) {
        ctx.body = ctx.result('success');
      } else {
        ctx.body = ctx.result('');
      }
    } catch (e) {
      throw e;
    }
  }

  async remove(
    ctx: Context,
    params = {},
    opts = {
      pk: 'code'
    }
  ): Promise<any> {
    const { pk = 'code' } = opts;
    const { model } = this;
    const condParams = { [pk]: params[pk] };
    const sql = model.remove().where(condParams).toSql();
    try {
      const dbResult = await ctx.db.mysql.query(sql.sql, sql.bindings);
      if (dbResult) {
        ctx.body = ctx.result('success');
      } else {
        ctx.body = ctx.result('');
      }
    } catch (e) {
      throw e;
    }
  }
}
