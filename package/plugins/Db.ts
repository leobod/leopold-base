import { MysqlRDB } from '../tools/MysqlRDB';
import { RedisRDB } from '../tools/RedisRDB';
import { isEmpty } from '../utils/obj';

class DbManager {
  constructor() {}

  setDb(key, value) {
    this[key] = value;
  }
  getDb(key, value) {
    return this[key];
  }
}

class Db {
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
    Db.instance = dbManager;
    return dbManager;
  }
}

const useDb = function () {
  return Db.instance;
};

export { Db, useDb };
