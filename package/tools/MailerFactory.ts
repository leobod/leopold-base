import nodemailer from 'nodemailer';

class Mailer {
  private config: any;
  private mailer: any;

  constructor(config = {}) {
    const emailConfigTemplate = {
      host: '',
      port: '',
      auth: {
        user: '', //这个表示的发送方的邮箱
        pass: '' //表示授权码.授权码获取方式在后面
      },
      secure: false
    };
    this.config = Object.assign({}, emailConfigTemplate, config);
    this.config.secure = Number(this.config.port) === 465;
    this.mailer = nodemailer.createTransport(this.config);
  }

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
  async send(tolist, subject, cclist, text, html, attachments) {
    const mailOptions = {
      from: this.config.auth.user /* 发件邮箱 */,
      to: tolist /* 接收方 */,
      subject: subject // 主题
    };
    cclist && (mailOptions['cc'] = cclist);
    text && (mailOptions['text'] = text);
    html && (mailOptions['html'] = html);
    if (attachments && attachments !== this.isJSON(JSON.stringify(attachments))) {
      mailOptions['attachments'] = attachments;
    }
    // 发送邮件
    const res = await this.mailer.sendMail(mailOptions);
    return res;
  }

  isJSON(str) {
    if (typeof str == 'string') {
      try {
        const obj = JSON.parse(str);
        return typeof obj == 'object' && obj;
      } catch (e) {
        return false;
      }
    }
  }
}

export { Mailer };
