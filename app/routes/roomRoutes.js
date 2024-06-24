const express = require('express');
const router = express.Router();
const { verifyUser } = require('../middleware/authMiddleware');
const roomController = require('../controllers/roomController');

router.post('/', verifyUser, roomController.createRoom);
router.put('/:id', verifyUser, roomController.updateRoom);


module.exports = router;