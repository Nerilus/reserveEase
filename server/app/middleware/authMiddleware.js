const jwt = require('jsonwebtoken');
const User = require('../models/user');
const dotenv = require("dotenv");

dotenv.config();
const secret = process.env.JWTKEY;

exports.verifyUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (token) {
      const decoded = jwt.verify(token, secret);
      req.user = {
        id: decoded.id,
        isAdmin: decoded.isAdmin
      };
    }
    next();
  } catch (error) {
    res.status(401).json({ message: "Authentication failed" });
  }
};