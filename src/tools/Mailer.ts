

const nodemailer  = require("nodemailer")
const emailConfig = require('../config').email

/**
 * tolist       接收方的邮箱 //'li@latelee.org, latelee@163.com',//收件人邮箱，多个邮箱地址间用英文逗号隔开
 * subject      邮件主题 标题
 * cclist       抄送 //'li@latelee.org, latelee@163.com',//收件人邮箱，多个邮箱地址间用英文逗号隔开
 * text         邮箱文本
 * html         邮箱html格式的文本
 * attachments  附件[{
 *                    filename: 'img1.png',            // 改成你的附件名
 *                    path: 'public/images/img1.png',  // 改成你的附件路径
 *                    cid : '00000001'                 // cid可被邮件使用
 *                  }]
 */
async function sendEmail(tolist, subject, cclist, text, html, attachments) {
  // 对465为 true，对其他端口为 false
  emailConfig.secure = (emailConfig.port == 465)
  // 使用默认的SMTP传输创建可重用的传输器对象
  const transporter = nodemailer.createTransport(emailConfig)
  const mailOptions = {
    from: emailConfig.auth.user,  // 谁发的
    to: tolist,   // 发给谁
    subject: subject,   // 主题
    // text: 'this is an example by nodemailer',    // 文本内容
    // html: '',    // html模板
    // attachments: [   // 附件信息
    //   {
    //     filename: '',
    //     path: ''
    //   }
    // ]
  }
  cclist && (mailOptions['cc'] = cclist)
  text && (mailOptions['text'] = text)
  html && (mailOptions['html'] = html)
  if(attachments && attachments!== isJSON(JSON.stringify(attachments))) {
    mailOptions['attachments'] = attachments
  }
  // 发送邮件
  const res = await transporter.sendMail(mailOptions)
  return res
}

function isJSON(str) {
  if (typeof str == 'string') {
    try {
      const obj = JSON.parse(str)
      return (typeof obj == 'object' && obj )
    } catch(e) {
      return false
    }
  }
}

module.exports = {
  sendEmail
}
