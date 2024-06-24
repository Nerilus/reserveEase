const Hotel = require("../models/Hotel");
const { Op } = require('sequelize');


exports.getAllHotels = async (req, res)=>{
    try{
        const hotels = await Hotel.findAll();
        res.status(200).json(hotels);
    } catch (err){
        res.status(500).json({ message: 'Erreur lors de la récupération des hôtels', error: err.message });
    }
}


exports.createHotel = async (req, res) => {
    const { name, type, city, address, distance, photos, title, description, rating, rooms, cheapest_price, featured } = req.body;
  
    // Check if the current user is an admin
    if (!req.body.currentUserAdmin) {
      return res.status(403).json({ message: "Access denied. Only admins can create hotels." });
    }
  
    try {
      // Check if a hotel with the same name already exists
      const existingHotel = await Hotel.findOne({ where: { name } });
      if (existingHotel) {
        return res.status(400).json({ message: "Hotel with this name already exists." });
      }
  
      // Create a new hotel
      const newHotel = await Hotel.create({
        name,
        type,
        city,
        address,
        distance,
        photos,
        title,
        description,
        rating,
        rooms,
        cheapest_price,
        featured
      });
      res.status(201).json(newHotel);
    } catch (err) {
      res.status(500).json({ message: 'Error creating hotel', error: err.message });
    }
  };


exports.getHotelById = async (req, res) => {
    const { id } = req.params;
    try{
        const hotel = await Hotel.findByPk(id);
        if(!hotel){
            return res.status(404).json({ message : 'hotel non trouvé'})
        }
        res.status(200).json(hotel);
    } catch (err){
        res.status(500).json({ message: 'Erreur lors de la récupération de l\'hôtel', error: err.message });

    }
}

exports.deleteHotel = async (req, res) => {
    const { id } = req.params;
    try {
      // Check if the current user is an admin
      if (!req.body.currentUserAdmin) {
        return res.status(403).json({ message: "Access denied. Only admins can delete hotels." });
      }
  
      // Find the hotel by ID
      const hotel = await Hotel.findByPk(id);
      if (!hotel) {
        return res.status(404).json({ message: 'Hotel not found' });
      }
  
      // Delete the hotel
      await hotel.destroy();
      res.status(200).json({ message: 'Hotel deleted successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Error deleting the hotel', error: err.message });
    }
  };
 
// exports.getHotels = async (req, res, next) => {
//     const { min, max, ...others } = req.query;
//     try {
//         const hotels = await Hotel.findAll({
//             where: {
//                 ...others,
//                 cheapest_price: {
//                     [Op.gte]: min || 1,
//                     [Op.lte]: max || 999
//                 }
//             },
//             limit: req.query.limit ? parseInt(req.query.limit) : undefined
//         });
//         res.status(200).json(hotels);
//     } catch (err) {
//         next(err);
//     }
// };