const bcrypt = require("bcryptjs");
const User = require("../models/user");
const { createError } = require("../utils/error");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const { Op } = require('sequelize');




exports.login = async (req, res, next) => {
  const { username, password } = req.body;

  try {
    console.log("Username:", username);
    const user = await User.findOne({ where: { username } });

    if (user) {
      const validity = await bcrypt.compare(password, user.password);

      if (!validity) {
        res.status(400).json("wrong password");
      } else {
        const token = jwt.sign(
          { username: user.username, id: user.id, isAdmin: user.is_admin },
          process.env.JWTKEY,
          { expiresIn: "1h" }
        );
        res.status(200).json({ user, token });
      }
    } else {
      res.status(404).json("User not found");
    }
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json(err);
  }
};


exports.register = async (req, res, next) => {
  try {
    const { username, password, email, is_admin } = req.body;

    // Vérification si l'utilisateur existe déjà
    const oldUser = await User.findOne({ where: { username } });
    if (oldUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hachage du mot de passe
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    // Création de l'utilisateur
    const newUser = await User.create({
      username,
      password: hash,
      email,
      is_admin: is_admin || false 
    });

    // Génération du token JWT
    const token = jwt.sign(
      { username: newUser.username, id: newUser.id, isAdmin: newUser.is_admin },
      process.env.JWTKEY,
      { expiresIn: "1h" }
    );

    res.status(200).json({ user: newUser, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return next(createError(404, 'User not found'));
    }

    // Génération du token de réinitialisation
    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    const resetPasswordExpires = Date.now() + 3600000; // 1 heure en millisecondes

    // Mise à jour de l'utilisateur en base de données avec le token et l'expiration
    user.reset_password_token = resetPasswordToken;
    user.reset_password_expires = new Date(resetPasswordExpires);
    await user.save();

    // Construction du lien de réinitialisation
    const resetURL = `${req.protocol}://${req.get('host')}/api/auth/resetPassword/${resetToken}`;
    const message = `You are receiving this email because you (or someone else) have requested the reset of a password. Please make a PUT request to: \n\n ${resetURL}`;

    // Envoi de l'e-mail avec le token de réinitialisation
    await sendEmail(email, 'Password Reset Token', message);

    res.status(200).json({ message: 'Email sent' });
  } catch (err) {
    next(err);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const resetToken = req.params.token;
    const { newPassword } = req.body;

    // Recherche de l'utilisateur avec le token de réinitialisation correspondant
    const user = await User.findOne({
      where: {
        reset_password_token: crypto.createHash('sha256').update(resetToken).digest('hex'),
        reset_password_expires: { $gt: new Date() }, // Vérifie si le token n'a pas expiré
      },
    });

    if (!user) {
      return next(createError(400, 'Invalid token or token has expired'));
    }

    // Hachage du nouveau mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Mise à jour du mot de passe de l'utilisateur et suppression du token de réinitialisation
    user.password = hashedPassword;
    user.reset_password_token = null;
    user.reset_password_expires = null;
    await user.save();

    res.status(200).json({ message: 'Password has been reset' });
  } catch (err) {
    next(err);
  }
};