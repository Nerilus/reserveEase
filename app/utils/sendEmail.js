const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
    logger: true, // Enable logging for troubleshooting
    debug: true // Enable debug output for troubleshooting
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: options.email,
    subject: options.subject,
    text: options.message
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Email could not be sent');
  }
};

module.exports = sendEmail;
