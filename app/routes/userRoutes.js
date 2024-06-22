const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();

router.get('/getusers', userController.getUsers);


module.exports = router;
