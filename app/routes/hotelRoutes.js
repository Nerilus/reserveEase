const express = require('express')
const router = express.Router();
const hotelController = require('../controllers/hotelController');

router.get('/find', hotelController.getAllHotels);
router.post('/', hotelController.createHotel);
router.get('/:id', hotelController.getHotelById);
router.delete('/:id', hotelController.deleteHotel);
// router.get("/",  hotelController.getHotels);

 


module.exports = router; 