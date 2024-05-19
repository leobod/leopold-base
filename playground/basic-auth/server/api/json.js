module.exports = async (ctx) => {
  const data = [
    { type: 'title', value: 'Hello, Leopold' },
    { type: 'content', value: 'use as api server' }
  ];
  ctx.body = ctx.result(data);
};
