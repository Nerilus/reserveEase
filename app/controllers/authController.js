const bcrypt = require("bcryptjs");
const User = require("../models/user");
const { createError } = require("../utils/error");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");



exports.login = async (req, res, next) => {
  const { username, password } = req.body;

  try {
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
    res.status(500).json(err);
  }
};

exports.register = async (req, res, next) => {
  try {
    const { username, password, email, country, city, phone, is_admin } = req.body;

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
      country,
      city,
      phone,
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
      const user = await User.findOne({ where: { email: req.body.email } });
      if (!user) return next(createError(404, "User not found"));
  
      const resetToken = crypto.randomBytes(20).toString('hex');
      const resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
      const resetPasswordExpires = Date.now() + 3600000; // 1 hour
  
      user.reset_password_token = resetPasswordToken;
      user.reset_password_expires = resetPasswordExpires;
      await user.save();
  
      const resetURL = `${req.protocol}://${req.get('host')}/api/auth/resetPassword/${resetToken}`;
      const message = `You are receiving this email because you (or someone else) have requested the reset of a password. Please make a PUT request to: \n\n ${resetURL}`;
  
      try {
        await sendEmail({
          email: user.email,
          subject: 'Password reset token',
          message
        });
        res.status(200).json({ message: 'Email sent' });
      } catch (err) {
        console.error('Error sending email:', err);
        user.reset_password_token = undefined;
        user.reset_password_expires = undefined;
        await user.save();
        return next(createError(500, "Email could not be sent"));
      }
    } catch (err) {
      next(err);
    }
  };
  

  exports.resetPassword = async (req, res, next) => {
    try {
      const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
  
      const user = await User.findOne({
        where: {
          reset_password_token: resetPasswordToken,
          reset_password_expires: { [Op.gt]: Date.now() }
        }
      });
  
      if (!user) {
        return next(createError(400, "Invalid token or token has expired"));
      }
  
      const salt = bcrypt.genSaltSync(10);
      user.password = bcrypt.hashSync(req.body.password, salt);
      user.reset_password_token = undefined;
      user.reset_password_expires = undefined;
      await user.save();
  
      res.status(200).json({ message: "Password has been reset" });
    } catch (err) {
      next(err);
    }
  };