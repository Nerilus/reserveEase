const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const createError = require('http-errors');

dotenv.config();

const sendEmail = async (email, subject, message) => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.hostinger.com', // Adresse SMTP de Hostinger
      port: 587, // Port SMTP de Hostinger
      secure: false, // true pour le port 465, false pour les autres ports
      auth: {
        user: process.env.EMAIL_USERNAME, // Votre nom d'utilisateur SMTP
        pass: process.env.EMAIL_PASSWORD, // Votre mot de passe SMTP
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_FROM, // Votre adresse e-mail d'envoi
      to: email, // Adresse e-mail du destinataire
      subject, // Objet du message
      text: message, // Corps du message au format texte
    };

    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    throw createError(500, 'Email could not be sent');
  }
};

module.exports = sendEmail;