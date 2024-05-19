import { isEmpty } from '../utils/obj';
import { MysqlRDB } from './MysqlRDB';
import { RedisRDB } from './RedisRDB';

export interface DbManagerDef {
  [key: string]: MysqlRDB | RedisRDB | any;
}

export class DbManager implements DbManagerDef {
  constructor() {}

  setDb(key, value) {
    this[key] = value;
  }
  getDb(key, value) {
    return this[key];
  }
}

class DbFactory {
  public static instance: DbManager | null = null;

  public static onCreate(config = {}) {
    const dbManager = new DbManager();
    if (!isEmpty(config)) {
      for (const key in config) {
        const item = config[key];
        if (item.type === 'MYSQL' && !isEmpty(item.config)) {
          dbManager.setDb(key, new MysqlRDB(item.config));
        }
        if (item.type === 'REDIS' && !isEmpty(item.config)) {
          dbManager.setDb(key, new RedisRDB(item.config));
        }
      }
    }
    DbFactory.instance = dbManager;
    return dbManager;
  }
}

export { DbFactory };
