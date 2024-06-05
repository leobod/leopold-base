module.exports = async (ctx) => {
  // await ctx.db.redis.query(['hmset', 'account:leobod@eside.cn', 'code', '123', 'loginAt', '2024/06/05/21:00']);
  // ctx.body = 'success';

  const hgetAllArray = await ctx.db.redis.query(['HGETALL', 'account:leobod@eside.cn']);
  const obj = hgetAllArray.reduce((accumulator, currentValue, index) => {
    if (index % 2 === 0) {
      accumulator[currentValue] = hgetAllArray[index + 1];
    }
    return accumulator;
  }, {});
  ctx.body = obj;
};

/**
 {
 "accepted": [
 "leobod@eside.cn"
 ],
 "rejected": [],
 "ehlo": [
 "8BITMIME",
 "AUTH=PLAIN LOGIN XOAUTH2 XALIOAUTH",
 "AUTH PLAIN LOGIN XOAUTH2 XALIOAUTH",
 "PIPELINING",
 "DSN"
 ],
 "envelopeTime": 460,
 "messageTime": 174,
 "messageSize": 347,
 "response": "250 Data Ok: queued as freedom",
 "envelope": {
 "from": "msg@eside.cn",
 "to": [
 "leobod@eside.cn"
 ]
 },
 "messageId": "<3dbc985a-3c15-4dad-56c0-e2d77659d40a@eside.cn>"
 }
 */
