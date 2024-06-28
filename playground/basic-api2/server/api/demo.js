const { GET, POST } = require('../../../../dist/index');
module.exports = {
  index: GET(async (ctx) => {
    ctx.body = 'This is GET Method';
  }),
  list: POST(async (ctx) => {
    ctx.body = 'This is Post Method';
  }),
  mix: (ctx) => {
    if (ctx.method === 'GET') {
      ctx.body = 'This is GET Method';
    } else if (ctx.method === 'POST') {
      ctx.body = 'This is Post Method';
    }
  }
};
