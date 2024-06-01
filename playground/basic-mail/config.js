module.exports = {
  path: '.',
  port: 8360,
  modules: {
    Mail: {
      msg: {
        type: 'NODEMAILER',
        name: 'ESIDE邮件发送者',
        config: {
          host: 'smtp.qiye.aliyun.com', // smtp.qiye.aliyun.com
          port: 465,
          auth: {
            user: '',
            pass: ''
          },
          secure: true
        }
      }
    }
  }
};
