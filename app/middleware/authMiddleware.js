const jwt = require('jsonwebtoken');
const User = require('../models/user');
const dotenv = require("dotenv");

dotenv.config();
const secret = process.env.JWTKEY;

exports.verifyUser = async (req, res, next) => {
    try {
      const token = req.headers.authorization.split(" ")[1];
    //   console.log('Token:', token);
      if (token) {
        const decoded = jwt.verify(token, secret);
        // console.log('Decoded:', decoded);
        req.body.currentUserId = decoded.id;
        req.body.currentUserAdmin = decoded.isAdmin;
        // console.log('Middleware request body:', req.body);
      }
      next();
    } catch (error) {
    //   console.log('Auth error:', error);
      res.status(401).json({ message: "Authentication failed" });
    }
};