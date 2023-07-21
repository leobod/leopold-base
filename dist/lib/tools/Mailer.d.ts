declare const nodemailer: any;
declare const emailConfig: any;
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
declare function sendEmail(tolist: any, subject: any, cclist: any, text: any, html: any, attachments: any): Promise<any>;
declare function isJSON(str: any): any;
