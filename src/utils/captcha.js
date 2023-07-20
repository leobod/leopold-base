const svgCaptcha = require('svg-captcha')
const captchapng = require('captchapng')

const getCaptcha = function(content, type='png') {
  let result = null
  switch (type) {
    case 'png': {
      result = getPngCaptcha(content)
      break
    }
    case 'svg': {
      result = getSvgCaptcha()
      break
    }
    default: {
      result = getPngCaptcha(content)
      break
    }
  }
  return result
}

const getSvgCaptcha = function() {
  // 设置字母随机验证码相关属性
  let options = {
    size: 6, // 4个字母
    noise: 4, // 干扰线2条
    color: true, // 文字颜色
    background: '#FFFFFF', // 背景颜色
    ignoreChars: '0oO1ilI' // 验证码字符中排除 0o1i
    // 数字的时候，设置下面属性。最大，最小，加或者减
    // mathMin: 1,
    // mathMax: 30,
    // mathOperator: "+",
  }
  let captcha = svgCaptcha.create(options) //字母和数字随机验证码
  // let captcha = svgCaptcha.createMathExpr(options) //数字算数随机验证码
  /* text是指产生的验证码，data指svg的字节流信息 */
  /* ctx.type = 'image/svg+xml' */
  /* ctx.body = { img: captcha.data, str: captcha.text } */
  return captcha.data
}

const getPngCaptcha = function(content) {
  const p = new captchapng(80, 30, content)
  p.color(0, 0, 0, 0)
  p.color(80, 80, 80, 255)
  const base64 = p.getBase64()
  // 'data:image/png;base64,' + base64,
  return base64
}

module.exports = {
  getCaptcha
}
