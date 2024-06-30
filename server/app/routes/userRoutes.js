const express = require('express');
const userController = require('../controllers/userController');
const {  verifyUser } = require('../middleware/authMiddleware');
const router = express.Router();

console.log(userController.deleteUser);
console.log(verifyUser); 


router.get('/', verifyUser, userController.getUsers);
router.get('/:id', userController.getUser);
router.delete('/user/:id', verifyUser, userController.deleteUser);




module.exports = router;
 