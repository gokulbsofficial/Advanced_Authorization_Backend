"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMail = void 0;
var sgMail = require('@sendgrid/mail');
sgMail.setApiKey("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");
function sendMail(data, method) {
    var isActivate = method === "Activate";
    var to = data.to, name = data.name, link = data.link;
    var msg = {
        to: to,
        from: 'gokulsreejith22002@gmail.com',
        templateId: 'd-134728a86f8940cc9519dbb5474d44a4',
        dynamic_template_data: {
            "brand": "GS Shopping",
            "title": isActivate ? "Activate Your Account" : "Reset Password",
            "username": name,
            "subject": isActivate ? "activate" : "change the password",
            "description": isActivate ? "activate your account" : "reset your password",
            "method": isActivate ? "Activate Account" : "Reset Password",
            "expire": isActivate ? "10" : "5",
            "button": isActivate ? "Activate Account" : "Reset Password",
            "phonenumber": "918870780689",
            "email": "gokulsreejith22002@gmail.com",
            "location": "Tamilnadu, India",
            "link": link,
            "facebook": "www.facebook.com",
            "twitter": "www.twitter.com",
            "youtube": "www.youtube.com",
            "instagram": "www.instagram.com",
            "website": "https://shop.gokulsreejith.xyz"
        }
    };
    return new Promise(function (resolve, reject) {
        sgMail
            .send(msg)
            .then(function (res) {
            resolve({ statusCode: res[0].statusCode, msgId: res[0].headers["x-message-id"] });
        }).catch(function (err) {
            reject(err);
        });
    });
}
exports.sendMail = sendMail;
