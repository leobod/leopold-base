const { SQLModel, SQLModelType, Service } = require('../dist/index')

const UserModel = new SQLModel({
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
})

class UserService2 extends Service {
  constructor() {
    super(UserModel, { format: 'Line2Camel' })
  }
}

class UserService extends Service {
  constructor() {
    super(UserModel, { format: 'Line2Camel', order_by_key: 'create_at' })
  }
}

describe('[ServiceSimple].list', () => {
  test(`ServiceSimple.list()_sql`, () => {
    let sql = 'SELECT user.id AS `id`, user.dep_id AS `dep_id`, user.name AS `name`, user.update_at AS `update_at`, user.create_at AS `create_at` FROM `user` WHERE user.id = ? ORDER BY create_at;'
    const searchForm = {
      id: 1
    }
    const userService = new UserService()
    const current = userService.getListSQLModel(searchForm).toSql()
    // const formatedSql = formatSql(current.sql, current.bindings);
    expect(current.sql).toBe(sql)
  })

  test(`UserService2_no_order_by.list()_sql`, () => {
    let sql = 'SELECT user.id AS `id`, user.dep_id AS `dep_id`, user.name AS `name`, user.update_at AS `update_at`, user.create_at AS `create_at` FROM `user` WHERE user.id = ?;'
    const searchForm = {
      id: 1
    }
    const userService = new UserService2()
    const current = userService.getListSQLModel(searchForm).toSql()
    // const formatedSql = formatSql(current.sql, current.bindings);
    expect(current.sql).toBe(sql)
  })

  test(`UserService2_custom_order_by.list()_sql`, () => {
    let sql = 'SELECT user.id AS `id`, user.dep_id AS `dep_id`, user.name AS `name`, user.update_at AS `update_at`, user.create_at AS `create_at` FROM `user` WHERE user.id = ? ORDER BY user.create_at DESC;'
    const searchForm = {
      id: 1
    }
    const userService = new UserService2()
    const current = userService.getListSQLModel(searchForm, { order_by_key: 'user.create_at DESC' }).toSql()
    // const formatedSql = formatSql(current.sql, current.bindings);
    expect(current.sql).toBe(sql)
  })
})
