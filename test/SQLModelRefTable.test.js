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
    showId: {
      ref: 'user',
      origin: 'id'
    },
    firstName: {
      type: new SQLModelType.VARCHAR(100)
    },
    lastName: {
      type: new SQLModelType.VARCHAR(100)
    }
  }
});

describe('[SQLModel].select.Ref', () => {
  test(`User.select('id')_ref_showId`, () => {
    let sql = `SELECT user.id AS id, user.id AS showId, user.firstName AS firstName, user.lastName AS lastName FROM user WHERE user.id = ?;`;
    const searchForm = { showId: '1' };
    const current = User.select('*').where(searchForm).toSql();
    expect(current.sql).toBe(sql);
  });

  test(`User.select('id')_ref_name`, () => {
    let sql = `SELECT user.id AS id, user.id AS showId, user.firstName AS firstName, user.lastName AS lastName, CONCAT(user.firstName, ',', user.lastName) as name FROM user WHERE user.id = ?;`;
    const searchForm = { showId: '1' };
    const current = User.select('*').selectRaw(`CONCAT(user.firstName, ',', user.lastName) as name`).where(searchForm).toSql();
    expect(current.sql).toBe(sql);
  });
});
