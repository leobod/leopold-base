import { Context } from 'koa';
import { Service } from './Service';

export class DefaultService extends Service {
  error_custom: boolean;
  error_message: string;
  constructor(
    model,
    opts = { format: 'Line2Camel', error_custom: true, error_message: 'Unknown Error' }
  ) {
    super(model, opts);
    this.error_custom = opts.error_custom;
    this.error_message = opts.error_message;
  }

  async list(
    ctx: Context,
    params = {},
    opts = {
      page_num_key: 'page_num',
      page_szie_key: 'page_size'
    }
  ) {
    try {
      ctx.body = ctx.result(await super.list(ctx, params, opts));
    } catch (e) {
      if (this.error_custom) {
        throw new Error(this.error_message);
      } else {
        throw e;
      }
    }
  }

  async listOne(
    ctx: Context,
    params = {},
    opts = {
      order_by_has: true,
      order_by_key: 'create_at',
      order_by_val: 'DESC'
    }
  ) {
    try {
      ctx.body = ctx.result(await super.listOne(ctx, params, opts));
    } catch (e) {
      if (this.error_custom) {
        throw new Error(this.error_message);
      } else {
        throw e;
      }
    }
  }

  async add(ctx: Context, params = {}, opts = {}) {
    try {
      ctx.body = ctx.result(await super.add(ctx, params, opts));
    } catch (e) {
      if (this.error_custom) {
        throw new Error(this.error_message);
      } else {
        throw e;
      }
    }
  }

  async edit(
    ctx: Context,
    params = {},
    opts = {
      update_time_modify: true,
      update_time_key: 'update_at',
      pk: 'code'
    }
  ) {
    try {
      ctx.body = ctx.result(await super.edit(ctx, params, opts));
    } catch (e) {
      if (this.error_custom) {
        throw new Error(this.error_message);
      } else {
        throw e;
      }
    }
  }

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
  ) {
    try {
      ctx.body = ctx.result(await super.softRemove(ctx, params, opts));
    } catch (e) {
      if (this.error_custom) {
        throw new Error(this.error_message);
      } else {
        throw e;
      }
    }
  }

  async remove(
    ctx: Context,
    params = {},
    opts = {
      pk: 'code'
    }
  ) {
    try {
      ctx.body = ctx.result(await super.remove(ctx, params, opts));
    } catch (e) {
      if (this.error_custom) {
        throw new Error(this.error_message);
      } else {
        throw e;
      }
    }
  }
}
