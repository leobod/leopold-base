const jwt = require('jsonwebtoken');

const secret = '';

const createToken = function (data = {}) {
  // jwt.sign({ foo: 'bar' }, 'secret_shhhhh');
  // // 方式一
  // jwt.sign({
  //   exp: Math.floor(Date.now() / 1000) + (60 * 60),
  //   data: 'foobar'
  // }, 'secret');
  // 方式二 推荐使用 7d表示7天过期
  return jwt.sign({}, 'secret', { expiresIn: '1h' });
};

const verifyToken = function (token) {
  // verify a token symmetric - synchronous
  var decoded = jwt.verify(token, 'secret_shhhhh');
  console.log(decoded); // { foo: 'bar', iat: 1644312929 }
  // 如果想要把3段都输出来，即{ header, payload, signature }
  var decoded1 = jwt.verify(token, 'secret_shhhhh', { complete: true });
  /* {
  header: { alg: 'HS256', typ: 'JWT' },
  payload: { foo: 'bar', iat: 1644312990 },
  signature: 'hTf9bM3S4Y9XaoRRr9LVWecDnPHZ7n4Ma9CrnmjRqSE'
  }*/

  /**
   * // invalid token - synchronous
   * try {
   *   var decoded = jwt.verify(token, 'wrong-secret');
   * } catch(err) {
   *   	// err
   *   	// 如果超时 err.message = 'jwt expired'
   *     // 如果token解析不了 err.message = 'invalid token'
   *     // 如果签名错误 err.message = 'invalid signature'
   *     // 其他错误查看GitHub
   *     // ctx.throw(401, 'token error');
   * }
   */

  // app.use(jwt({ secret: 'my-secret' }).unless({ path: [/^\/api\/login/, /^\/api\/register/]}));
};

export {
  createToken,
  verifyToken
}
