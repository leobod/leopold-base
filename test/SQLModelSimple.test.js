const { SQLModel, SQLModelType, formatSql } = require('../dist/index');

const User = new SQLModel({
  table: 'user',
  column: {
    id: {
      type: new SQLModelType.INTEGER(),
      allowNull: false,
      autoIncrement: true,
      unique: true,
      primaryKey: true,
      operate: '='
    },
    dep_id: {
      type: new SQLModelType.INTEGER(),
      allowNull: false,
      primaryKey: true,
      operate: '='
    },
    name: {
      type: new SQLModelType.VARCHAR(50),
      allowNull: false,
      operate: 'LIKE'
    },
    group: {
      type: new SQLModelType.VARCHAR(50),
      allowNull: false,
      operate: (key, val, bindings) => {
        bindings.push(val[0]);
        bindings.push(val[1]);
        return `(${key} > ? AND ${key} < ?)`;
      }
    }
  }
});

const UserModel = new SQLModel({
  table: 'tb_user',
  column: {
    code: {
      type: SQLModelType.VARCHAR(100),
      allowNull: false,
      unique: true,
      primaryKey: true,
      comment: '用户code'
    },
    fk_group: {
      type: SQLModelType.VARCHAR(100),
      allowNull: false,
      defaultExpr: 'leopold',
      comment: '用户所在group'
    },
    fk_department: {
      type: SQLModelType.VARCHAR(100),
      comment: '用户所在部门'
    },
    account: {
      type: SQLModelType.VARCHAR(100),
      allowNull: false,
      unique: true,
      comment: '用户账号'
    },
    passwd: {
      type: SQLModelType.VARCHAR(100),
      allowNull: false,
      unique: true,
      comment: '用户密码'
    },
    name: {
      type: SQLModelType.VARCHAR(50),
      comment: '用户名称'
    },
    description: {
      type: SQLModelType.VARCHAR(100),
      comment: '用户描述'
    },
    sex: {
      type: SQLModelType.INTEGER(),
      defaultExpr: '0',
      comment: '用户性别 男(1) 女(2) 未知(0)'
    },
    phone_area_code: {
      type: SQLModelType.VARCHAR(10),
      defaultExpr: '86'
    },
    phone: {
      type: SQLModelType.VARCHAR(20)
    },
    email: {
      type: SQLModelType.VARCHAR(20)
    },
    state: {
      type: SQLModelType.INTEGER(),
      allowNull: false,
      defaultExpr: '1',
      comment: '正常(1) 锁定(2) 注销(3)'
    },
    update_at: {
      type: SQLModelType.DATETIME(),
      defaultExpr: 'CURRENT_TIMESTAMP',
      otherExpr: 'ON UPDATE CURRENT_TIMESTAMP'
    },
    create_at: {
      type: SQLModelType.DATETIME(),
      defaultExpr: 'CURRENT_TIMESTAMP'
    }
  }
});

describe('[SQLModel].create_drop', () => {
  test('User.create().toSql()', () => {
    let sql =
      'CREATE TABLE IF NOT EXISTS user (id INTEGER NOT NULL AUTO_INCREMENT UNIQUE, dep_id INTEGER NOT NULL, name VARCHAR(50) NOT NULL, PRIMARY KEY (id,dep_id));';
    expect(User.create().toSql().sql).toBe(sql);
  });
  test('User.create(true).toSql()', () => {
    let sql =
      'CREATE TABLE user (id INTEGER NOT NULL AUTO_INCREMENT UNIQUE, dep_id INTEGER NOT NULL, name VARCHAR(50) NOT NULL, PRIMARY KEY (id,dep_id));';
    expect(User.create(true).toSql().sql).toBe(sql);
  });
  test('User.drop().toSql()', () => {
    let sql = 'DROP TABLE IF EXISTS user;';
    expect(User.drop().toSql().sql).toBe(sql);
  });
  test(`User.drop(true).toSql()`, () => {
    let sql = 'DROP TABLE user;';
    expect(User.drop(true).toSql().sql).toBe(sql);
  });
});

describe('[SQLModel].select', () => {
  test(`User.select('id')_id`, () => {
    let sql = `SELECT user.id AS id FROM user WHERE user.id = ?;`;
    const searchForm = {
      id: 1
    };
    const current = User.select('id').where(searchForm).toSql();
    // const formatedSql = formatSql(current.sql, current.bindings);
    expect(current.sql).toBe(sql);
  });
  test(`User.select('id')_name`, () => {
    let sql = `SELECT user.id AS id FROM user WHERE user.id = ? AND user.name LIKE ?;`;
    const searchForm = {
      id: 1,
      name: 'test'
    };
    const current = User.select('id').where(searchForm).toSql();
    expect(current.sql).toBe(sql);
  });

  test(`User.select('id')_group`, () => {
    let sql = `SELECT user.id AS id FROM user WHERE user.id = ? AND user.name LIKE ? AND (user.group > ? AND user.group < ?);`;
    const searchForm = {
      id: 1,
      name: 'test',
      group: [10, 20]
    };
    const current = User.select('id').where(searchForm).toSql();
    // const finalSql = formatSql(current.sql, current.bindings)
    expect(current.sql).toBe(sql);
  });
});
