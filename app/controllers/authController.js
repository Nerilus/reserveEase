const bcrypt = require("bcryptjs");
const User = require("../models/user");
const { createError } = require("../utils/error");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");


exports.register = async (req, res, next) => {
    try {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);

        const newUser = await User.create({
            ...req.body,
            password: hash,
        });

        res.status(200).send("User has been created");
    } catch (err) {
        next(err);
    }
};


exports.login = async (req, res, next) => {
    try {
        const user = await User.findOne({ where: { username: req.body.username } });
        if (!user) return next(createError(404, "User not found"));

        const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);
        if (!isPasswordCorrect) return next(createError(400, "Wrong password or username"));

        const token = jwt.sign(
            { id: user.id, isAdmin: user.is_admin },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        const { password, is_admin, ...otherDetails } = user.toJSON();
        res
            .cookie("access_token", token, {
                httpOnly: true,
            })
            .status(200)
            .json({ details: { ...otherDetails }, isAdmin: is_admin });
    } catch (err) {
        next(err);
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