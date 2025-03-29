const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1) Create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // 2) define email options
  const mailOptions = {
    from: 'Shoislom Shobaxromov <hello@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html:
  };

  // 3) Actually send the email
  return await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;

// service: 'Gmail',
// auth: {
//   user: process.env.EMAIL_USERNAME,
//   password: process.env.EMAIL_PASSWORD,
// },
// Activate in gmail 'sess secure app' option
