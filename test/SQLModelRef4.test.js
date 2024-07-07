const { SQLModel, SQLModelType, formatSql } = require('../dist/index')

const ModuleModel = new SQLModel({
  table: 'tb_module',
  column: {
    code: {
      type: SQLModelType.VARCHAR(100),
      allowNull: false,
      unique: true,
      primaryKey: true,
      comment: 'code'
    },
    fk_group: {
      type: SQLModelType.VARCHAR(100),
      allowNull: false,
      defaultExpr: 'leopold',
      comment: '所在group'
    },
    key: {
      type: SQLModelType.VARCHAR(100),
      allowNull: false,
      unique: true,
      comment: '关键词'
    },
    name: {
      type: SQLModelType.VARCHAR(100),
      allowNull: false,
      comment: '名称'
    },
    type: {
      type: SQLModelType.INTEGER(),
      allowNull: false,
      defaultExpr: '1',
      comment: '页面(1) REST(2) 服务(3) 模块(4)'
    },
    audits: {
      type: SQLModelType.TEXT(),
      comment: '权限'
    },
    is_group: {
      type: SQLModelType.INTEGER(),
      allowNull: false,
      defaultExpr: '0',
      comment: '是(1) 否(0)'
    },
    fk_parent: {
      type: SQLModelType.VARCHAR(100),
      comment: '所在组'
    },
    fk_parent_name: {
      ref: 'tb_module',
      ref_table: 'tb_module',
      ref_alias: 'tb_module_parent',
      origin: 'name'
    },
    fk_parent_key: {
      ref: 'tb_module',
      ref_table: 'tb_module',
      ref_alias: 'tb_module_parent',
      origin: 'key'
    },
    is_show: {
      type: SQLModelType.INTEGER(),
      defaultExpr: '1',
      comment: '显示(1) 不显示(0)'
    },
    module_level: {
      type: SQLModelType.INTEGER(),
      allowNull: false,
      defaultExpr: '1',
      comment: '模块等级'
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
    tb_module: {
      JOIN: 'LEFT JOIN',
      ON: 'tb_module.fk_parent = tb_module.code'
    }
  }
})

describe('[SQLModel].select.Ref4', () => {
  test(`module.select('*')_ref4`, () => {
    let sql = `SELECT tb_module.code AS \`code\`, tb_module.fk_group AS \`fk_group\`, tb_module.key AS \`key\`, tb_module.name AS \`name\`, tb_module.type AS \`type\`, tb_module.audits AS \`audits\`, tb_module.is_group AS \`is_group\`, tb_module.fk_parent AS \`fk_parent\`, tb_module_parent.name AS \`fk_parent_name\`, tb_module_parent.key AS \`fk_parent_key\`, tb_module.is_show AS \`is_show\`, tb_module.module_level AS \`module_level\`, tb_module.state AS \`state\`, tb_module.update_at AS \`update_at\`, tb_module.create_at AS \`create_at\` FROM \`tb_module\` LEFT JOIN \`tb_module\` as \`tb_module_parent\` ON tb_module.fk_parent = tb_module.code ;`
    const searchForm = {}
    const current = ModuleModel.select('*').where(searchForm).toSql()
    expect(current.sql).toBe(sql)
  })

  test(`module.select('*')_ref4_withSearchForm`, () => {
    let sql = `SELECT tb_module.code AS \`code\`, tb_module.fk_group AS \`fk_group\`, tb_module.key AS \`key\`, tb_module.name AS \`name\`, tb_module.type AS \`type\`, tb_module.audits AS \`audits\`, tb_module.is_group AS \`is_group\`, tb_module.fk_parent AS \`fk_parent\`, tb_module_parent.name AS \`fk_parent_name\`, tb_module_parent.key AS \`fk_parent_key\`, tb_module.is_show AS \`is_show\`, tb_module.module_level AS \`module_level\`, tb_module.state AS \`state\`, tb_module.update_at AS \`update_at\`, tb_module.create_at AS \`create_at\` FROM \`tb_module\` LEFT JOIN \`tb_module\` as \`tb_module_parent\` ON tb_module.fk_parent = tb_module.code WHERE tb_module.type = ?;`
    const searchForm = { type: 1 }
    const current = ModuleModel.select('*').where(searchForm).toSql()
    expect(current.sql).toBe(sql)
  })
})
