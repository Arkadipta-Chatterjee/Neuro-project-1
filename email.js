const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');
const config = require('./config.js')

module.exports = class Email {
    constructor(user, url) {
        this.to = user.email;
        this.firstName = user.name.split(' ')[0];
        this.url = url;
        this.from = 'Arkadipta Chatterjee<arkadiptachatterjee@gmail.com>'

    }

    newTransport() {

        return nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'arkadiptachatterjee',
                pass: '8927604667'

            }
        })
    }


    async send(template, subject) {

        const html = pug.renderFile(`${__dirname}/${template}.pug`, {
            firstName: this.firstName,
            url: this.url,
            subject
        })




        const mailOptions = {
            from: this.from,
            to: this.to,
            subject,
            html: html,
            text: htmlToText.fromString(),

        }



        await this.newTransport().sendMail(mailOptions);


    }

    async sendresetPassword() {
        await this.send('resetPassword', 'Your password reset Token(valid for only 4 minutes)')
    }

    async sendConfirmationEmail() {
        await this.send('confirmation', 'Confirm your media account through email')
    }



}
