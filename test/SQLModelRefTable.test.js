const { SQLModel, SQLModelType } = require('../dist/index')

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

describe('[SQLModel.UserModel.getCreateTableSql]', () => {
    test('UserModel.getCreateTableSql()', () => {
        let sql = `CREATE TABLE IF NOT EXISTS tb_user (code VARCHAR(100) NOT NULL UNIQUE COMMENT '用户code',fk_group VARCHAR(100) NOT NULL DEFAULT 'leopold' COMMENT '用户所在group',fk_department VARCHAR(100) COMMENT '用户所在部门',account VARCHAR(100) NOT NULL UNIQUE COMMENT '用户账号',passwd VARCHAR(100) NOT NULL UNIQUE COMMENT '用户密码',name VARCHAR(50) COMMENT '用户名称',description VARCHAR(100) COMMENT '用户描述',sex INTEGER DEFAULT 0 COMMENT '用户性别 男(1) 女(2) 未知(0)',phone_area_code VARCHAR(10) DEFAULT '86',phone VARCHAR(20),email VARCHAR(20),state INTEGER NOT NULL DEFAULT 1 COMMENT '正常(1) 锁定(2) 注销(3)',update_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,create_at DATETIME DEFAULT CURRENT_TIMESTAMP,PRIMARY KEY (code));`
        expect(UserModel.getCreateTableSql()).toMatch(sql);
    })
    test('UserModel.getCreateTableSql({ force: true })', () => {
        let sql = `CREATE TABLE tb_user (code VARCHAR(100) NOT NULL UNIQUE COMMENT '用户code',fk_group VARCHAR(100) NOT NULL DEFAULT 'leopold' COMMENT '用户所在group',fk_department VARCHAR(100) COMMENT '用户所在部门',account VARCHAR(100) NOT NULL UNIQUE COMMENT '用户账号',passwd VARCHAR(100) NOT NULL UNIQUE COMMENT '用户密码',name VARCHAR(50) COMMENT '用户名称',description VARCHAR(100) COMMENT '用户描述',sex INTEGER DEFAULT 0 COMMENT '用户性别 男(1) 女(2) 未知(0)',phone_area_code VARCHAR(10) DEFAULT '86',phone VARCHAR(20),email VARCHAR(20),state INTEGER NOT NULL DEFAULT 1 COMMENT '正常(1) 锁定(2) 注销(3)',update_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,create_at DATETIME DEFAULT CURRENT_TIMESTAMP,PRIMARY KEY (code));`
        expect(UserModel.getCreateTableSql({ force: true })).toMatch(sql);
    });
    test('UserModel.getCreateTableSql({ wrap: true })', () => {
        let sql = "CREATE TABLE IF NOT EXISTS tb_user (\n" +
            "code VARCHAR(100) NOT NULL UNIQUE COMMENT '用户code',\n" +
            "fk_group VARCHAR(100) NOT NULL DEFAULT 'leopold' COMMENT '用户所在group',\n" +
            "fk_department VARCHAR(100) COMMENT '用户所在部门',\n" +
            "account VARCHAR(100) NOT NULL UNIQUE COMMENT '用户账号',\n" +
            "passwd VARCHAR(100) NOT NULL UNIQUE COMMENT '用户密码',\n" +
            "name VARCHAR(50) COMMENT '用户名称',\n" +
            "description VARCHAR(100) COMMENT '用户描述',\n" +
            "sex INTEGER DEFAULT 0 COMMENT '用户性别 男(1) 女(2) 未知(0)',\n" +
            "phone_area_code VARCHAR(10) DEFAULT '86',\n" +
            "phone VARCHAR(20),\n" +
            "email VARCHAR(20),\n" +
            "state INTEGER NOT NULL DEFAULT 1 COMMENT '正常(1) 锁定(2) 注销(3)',\n" +
            "update_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,\n" +
            "create_at DATETIME DEFAULT CURRENT_TIMESTAMP,\n" +
            "PRIMARY KEY (code)\n" +
            ");"
        expect(UserModel.getCreateTableSql({ wrap: true })).toMatch(sql);
    });
    test('UserModel.getCreateTableSql({ force: true, wrap: true })', () => {
        let sql = "CREATE TABLE tb_user (\n" +
            "code VARCHAR(100) NOT NULL UNIQUE COMMENT '用户code',\n" +
            "fk_group VARCHAR(100) NOT NULL DEFAULT 'leopold' COMMENT '用户所在group',\n" +
            "fk_department VARCHAR(100) COMMENT '用户所在部门',\n" +
            "account VARCHAR(100) NOT NULL UNIQUE COMMENT '用户账号',\n" +
            "passwd VARCHAR(100) NOT NULL UNIQUE COMMENT '用户密码',\n" +
            "name VARCHAR(50) COMMENT '用户名称',\n" +
            "description VARCHAR(100) COMMENT '用户描述',\n" +
            "sex INTEGER DEFAULT 0 COMMENT '用户性别 男(1) 女(2) 未知(0)',\n" +
            "phone_area_code VARCHAR(10) DEFAULT '86',\n" +
            "phone VARCHAR(20),\n" +
            "email VARCHAR(20),\n" +
            "state INTEGER NOT NULL DEFAULT 1 COMMENT '正常(1) 锁定(2) 注销(3)',\n" +
            "update_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,\n" +
            "create_at DATETIME DEFAULT CURRENT_TIMESTAMP,\n" +
            "PRIMARY KEY (code)\n" +
            ");"
        expect(UserModel.getCreateTableSql({ force: true, wrap: true })).toMatch(sql);
    });
});

describe('[SQLModel.select]', () => {
    test('UserModel.select', () => {
        expect(UserModel.select(['code']).sql()[0]).toMatch('SELECT code FROM tb_user tb_user;')
    })
});