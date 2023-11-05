"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mailer = void 0;
const nodemailer = require('nodemailer');
const emailConfig = {
    host: '',
    port: '',
    auth: {
        user: '',
        pass: '' //表示授权码.授权码获取方式在后面
    },
    secure: false
};
class Mailer {
    constructor(cofig) {
        this.config = cofig;
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
    send(tolist, subject, cclist, text, html, attachments) {
        return __awaiter(this, void 0, void 0, function* () {
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
            const res = yield this.mailer.sendMail(mailOptions);
            return res;
        });
    }
    isJSON(str) {
        if (typeof str == 'string') {
            try {
                const obj = JSON.parse(str);
                return typeof obj == 'object' && obj;
            }
            catch (e) {
                return false;
            }
        }
    }
}
exports.Mailer = Mailer;
