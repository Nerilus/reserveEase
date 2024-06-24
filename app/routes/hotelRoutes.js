const express = require('express')
const router = express.Router();
const hotelController = require('../controllers/hotelController');
const { verifyUser } = require('../middleware/authMiddleware');

router.get('/', hotelController.getAllHotels);
router.post('/',  verifyUser, hotelController.createHotel);
router.get('/:id', hotelController.getHotelById);
router.delete('/:id', verifyUser, hotelController.deleteHotel);


module.exports = router; 