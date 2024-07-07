const { SQLModel, SQLModelType, formatSql } = require('../dist/index')

const User = new SQLModel({
  table: 'tb_user',
  column: {
    code: {
      type: SQLModelType.VARCHAR(100),
      allowNull: false,
      unique: true,
      primaryKey: true,
      comment: '用户code',
      operate: 'LIKE'
    },
    fk_group: {
      type: SQLModelType.VARCHAR(100),
      allowNull: false,
      defaultExpr: 'leopold',
      comment: '用户所在group',
      operate: 'LIKE'
    },
    fk_department: {
      type: SQLModelType.VARCHAR(100),
      comment: '用户所在部门',
      operate: 'LIKE'
    },
    department_name: {
      ref: 'tb_department',
      ref_table: 'tb_department',
      origin: 'name'
    },
    account: {
      type: SQLModelType.VARCHAR(100),
      allowNull: false,
      unique: true,
      comment: '用户账号',
      operate: 'LIKE'
    },
    passwd: {
      type: SQLModelType.VARCHAR(100),
      allowNull: false,
      unique: true,
      comment: '用户密码'
    },
    name: {
      type: SQLModelType.VARCHAR(50),
      comment: '用户名称',
      operate: 'LIKE'
    },
    description: {
      type: SQLModelType.VARCHAR(100),
      comment: '用户描述',
      operate: 'LIKE'
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
  },
  ref: {
    tb_department: {
      JOIN: 'LEFT JOIN',
      ON: 'tb_department.code = tb_user.fk_department'
    }
  }
})

describe('[SQLModel].select.Ref2', () => {
  test(`User.select('*')_ref2`, () => {
    let sql = `SELECT tb_user.code AS \`code\`, tb_user.fk_group AS \`fk_group\`, tb_user.fk_department AS \`fk_department\`, tb_department.name AS \`department_name\`, tb_user.account AS \`account\`, tb_user.passwd AS \`passwd\`, tb_user.name AS \`name\`, tb_user.description AS \`description\`, tb_user.sex AS \`sex\`, tb_user.phone_area_code AS \`phone_area_code\`, tb_user.phone AS \`phone\`, tb_user.email AS \`email\`, tb_user.state AS \`state\`, tb_user.update_at AS \`update_at\`, tb_user.create_at AS \`create_at\` FROM \`tb_user\` LEFT JOIN \`tb_department\` as \`tb_department\` ON tb_department.code = tb_user.fk_department ;`
    const searchForm = {}
    const current = User.select('*').where(searchForm).toSql()
    expect(current.sql).toBe(sql)
  })

  test(`User.select('*')_ref2_where`, () => {
    let sql = `SELECT tb_user.code AS \`code\`, tb_user.fk_group AS \`fk_group\`, tb_user.fk_department AS \`fk_department\`, tb_department.name AS \`department_name\`, tb_user.account AS \`account\`, tb_user.passwd AS \`passwd\`, tb_user.name AS \`name\`, tb_user.description AS \`description\`, tb_user.sex AS \`sex\`, tb_user.phone_area_code AS \`phone_area_code\`, tb_user.phone AS \`phone\`, tb_user.email AS \`email\`, tb_user.state AS \`state\`, tb_user.update_at AS \`update_at\`, tb_user.create_at AS \`create_at\` FROM \`tb_user\` LEFT JOIN \`tb_department\` as \`tb_department\` ON tb_department.code = tb_user.fk_department WHERE tb_department.name = ?;`
    const searchForm = { department_name: '123' }
    const current = User.select('*').where(searchForm).toSql()
    expect(current.sql).toBe(sql)
  })
})
