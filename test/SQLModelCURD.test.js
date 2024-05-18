const { SQLModel, SQLModelType, formatSql } = require('../dist/index');

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
  },
  ref: {
    tb_department: 'tb_department.code = tb_user.fk_department'
  },
  filter: {
    passwd: (val, row = {}) => {
      return '**********';
    },
    sex: (val, row = {}) => {
      if (val === 1) {
        row.sex_name = '男';
      } else if (val === 2) {
        row.sex_name = '女';
      } else {
        row.sex_name = '未知';
      }
      return val;
    },
    phone: (val, row = {}) => {
      let phone = val;
      phone = phone.replace(phone.substring(3, 7), '****');
      return phone;
    },
    state: (val, row = {}) => {
      if (val === 1) {
        row.state_name = '正常';
      } else if (val === 2) {
        row.state_name = '锁定';
      } else {
        row.state_name = '注销';
      }
      return val;
    }
  }
});

describe('[SQLModel].insert', () => {
  test(`UserModel.insert(userObj).toSql()`, () => {
    let sql = `INSERT INTO tb_user (code, fk_group, account, paswd, sex, update_at) VALUES (?, ?, ?, ?, ?, ?);`;
    const userObj = {
      code: '123456',
      fk_group: 'leopold',
      account: 'leo',
      paswd: '######',
      sex: 0,
      update_at: new Date()
    };
    const current = UserModel.insert(userObj).toSql();
    // const finalSql = formatSql(current.sql, current.bindings)
    // console.log(finalSql);
    expect(current.sql).toBe(sql);
  });
});

describe('[SQLModel].update', () => {
  test(`UserModel.update(userObj).where({ code: '1234' }).toSql()`, () => {
    let sql = `UPDATE tb_user SET code = ?, fk_group = ?, account = ?, paswd = ?, sex = ?, update_at = ? WHERE tb_user.code = ?;`;
    const userObj = {
      code: '123456',
      fk_group: 'leopold',
      account: 'leo',
      paswd: '######',
      sex: 0,
      update_at: new Date()
    };
    const current = UserModel.update(userObj).where({ code: '123456' }).toSql();
    // const finalSql = formatSql(current.sql, current.bindings)
    // console.log(finalSql);
    expect(current.sql).toBe(sql);
  });
});

describe('[SQLModel].delete', () => {
  test(`UserModel.remove().where({ code: '1234' }).toSql()`, () => {
    let sql = `DELETE FROM tb_user WHERE tb_user.code = ?;`
    const current = UserModel.remove().where({ code: '123456' }).toSql();
    // const finalSql = formatSql(current.sql, current.bindings)
    // console.log(finalSql);
    expect(current.sql).toBe(sql);
  });
});
