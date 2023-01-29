import { SMTPClient } from 'smtp-client';

let s = new SMTPClient({
  host: 'onyebuchi2023@outlook.com',
  port: 25,
});

(async function () {
  await s.connect();
  await s.greet({ hostname: 'onyebuchi2023@outloook.com' }); // runs EHLO command or HELO as a fallback
  await s.authPlain({ username: 'Ernest', password: 'onyebuchi2020' }); // authenticates a user
  await s.mail({ from: 'onyebuchi2023@outlook.com' }); // runs MAIL FROM command
  await s.rcpt({ to: 'nwankwoernest2020@gmail.com' }); // runs RCPT TO command (run this multiple times to add more recii)
  await s.data('mail source'); // runs DATA command and streams email source
  await s.quit(); // runs QUIT command
})().catch(console.error);

// import nodemailer from 'nodemailer';

// // const transporter = nodemailer.createTransport({
// //   service: 'hotmail',
// //   Auth: {
// //     user: 'onyebuchi2023@outlook.com',
// //     pass: 'onyebuchi2020',
// //   },
// //   tls: {
// //     rejectUnauthorized: false,
// //   },
// // });

// // const options = {
// //   from: 'onyebuchi2023@outlook.com',
// //   to: 'nwankwoernest2020@gmail.com',
// //   subject: 'sending email with nodejs',
// //   text: 'first nodemailer text',
// // };

// // transporter.sendMail(options, function (err, info) {
// //   if (err) {
// //     console.log(err);
// //     return;
// //   } else {
// //     console.log('sent: ' + info.response);
// //   }
// // });

// // ('use strict');
// // // const nodemailer = require("nodemailer");

// // // async..await is not allowed in global scope, must use a wrapper
// // async function main() {
// //   // Generate test SMTP service account from ethereal.email
// //   // Only needed if you don't have a real mail account for testing
// //   let testAccount = await nodemailer.createTestAccount();

// //   // create reusable transporter object using the default SMTP transport
// //   let transporter = nodemailer.createTransport({
// //     host: 'smtp.ethereal.email',
// //     port: 587,
// //     secure: false, // true for 465, false for other ports
// //     auth: {
// //       user: 'test@onyebuchi2023@outlook.com', // generated ethereal user
// //       pass: 'onyebuchi2020', // generated ethereal password
// //     },
// //   });

// //   // send mail with defined transport object
// //   let info = await transporter.sendMail({
// //     from: '"Ernest Nwankwo 👻" <test@onyebuchi2023@outlook.com>', // sender address
// //     to: 'nwankwoernest2020@gmail.com', // list of receivers
// //     subject: 'Nodemailer ✔', // Subject line
// //     text: 'Hello world?', // plain text body
// //     html: '<b>Hello world?</b>', // html body
// //   });

// //   console.log('Message sent: %s', info.messageId);
// //   // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

// //   // Preview only available when sending through an Ethereal account
// //   console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
// //   // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
// // }

// // main().catch(console.error);
