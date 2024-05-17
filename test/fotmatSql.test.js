const { formatSql } = require('../dist');

describe('[formatSql]', () => {
  test(`formatSql('SELECT user.id AS id FROM user WHERE user.id = ?;', [1])`, () => {
    const sql = `SELECT user.id AS id FROM user WHERE user.id = 1;`;
    const current = formatSql('SELECT user.id AS id FROM user WHERE user.id = ?;', [1]);
    expect(current).toBe(sql);
  });

  test(`formatSql('SELECT user.id AS id FROM user WHERE user.id = ?;', ['1'])`, () => {
    const sql = `SELECT user.id AS id FROM user WHERE user.id = '1';`;
    const current = formatSql('SELECT user.id AS id FROM user WHERE user.id = ?;', ['1']);
    expect(current).toBe(sql);
  });

  test(`formatSql('SELECT user.id AS id FROM user WHERE user.id LIKE %?%;', ['TEST'])`, () => {
    const sql = `SELECT user.id AS id FROM user WHERE user.id LIKE '%TEST%';`;
    const current = formatSql('SELECT user.id AS id FROM user WHERE user.id LIKE ?;', [
      '%TEST%'
    ]);
    expect(current).toBe(sql);
  });

  test(`formatSql('SELECT user.id AS id FROM user WHERE user.id IN (?)', [['1', '2']])`, () => {
    const sql = `SELECT user.id AS id FROM user WHERE user.id IN ('1', '2');`;
    const current = formatSql('SELECT user.id AS id FROM user WHERE user.id IN (?);', [
      ['1', '2']
    ]);
    expect(current).toBe(sql);
  });

    test(`formatSql('SELECT user.id AS id FROM user WHERE user.id BETWEEN ? AND ?', ['10', '20'])`, () => {
        const sql = `SELECT user.id AS id FROM user WHERE user.id BETWEEN '10' AND '20';`;
        const current = formatSql('SELECT user.id AS id FROM user WHERE user.id BETWEEN ? AND ?;', ['10', '20']);
        expect(current).toBe(sql);
    });
});
