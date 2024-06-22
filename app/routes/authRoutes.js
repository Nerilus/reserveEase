const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgotPassword);
router.put('/resetPassword', authController.forgotPassword);



module.exports = router;
