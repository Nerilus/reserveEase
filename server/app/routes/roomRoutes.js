const express = require('express');
const router = express.Router();
const { verifyUser } = require('../middleware/authMiddleware');
const roomController = require('../controllers/roomController');

router.post('/:hotelId', verifyUser, roomController.createRoom);
router.put('/:id', verifyUser, roomController.updateRoom);
router.delete('/:id', verifyUser, roomController.deleteRoom);
router.get('/',  roomController.getAllRooms);
router.get('/:id',  roomController.getRoomById);





module.exports = router;