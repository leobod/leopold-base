module.exports = async (ctx) => {
  ctx.body = await ctx.mail.msg.send(
    'leobod@eside.cn',
    'ESIDE邮件验证码',
    null,
    null,
    `<div>验证码: 0863</div>`
  );
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
