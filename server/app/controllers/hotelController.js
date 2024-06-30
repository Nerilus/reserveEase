const { Op } = require('sequelize');
const multer = require('multer');
const path = require('path');
const Hotel = require('../models/Hotel');


exports.getAllHotels = async (req, res)=>{
    try{
        const hotels = await Hotel.findAll();
        res.status(200).json(hotels);
    } catch (err){
        res.status(500).json({ message: 'Erreur lors de la récupération des hôtels', error: err.message });
    }
}


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Append extension
  },
});

// Initialize upload
const upload = multer({ storage: storage });

exports.createHotel = [
  upload.array('photos', 10), // Utilisez Multer pour l'upload des fichiers
  async (req, res) => {
    const { name, type, city, address, room, description, rating, cheapest_price} = req.body;

    // Vérifier si l'utilisateur actuel est un admin
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: "Access denied. Only admins can create hotels." });
    }

    try {
      // Vérifier si un hôtel avec le même nom existe déjà
      const existingHotel = await Hotel.findOne({ where: { name } });
      if (existingHotel) {
        return res.status(400).json({ message: "Hotel with this name already exists." });
      }

      // Obtenir les chemins des fichiers des photos téléchargées
      const photos = req.files.map(file => file.path);

      // Créer un nouvel hôtel
      const newHotel = await Hotel.create({
        name,
        type,
        city,
        address,
        room,
        photos,
        description,
        rating,
        cheapest_price,
      });

      res.status(201).json(newHotel);
    } catch (err) {
      res.status(500).json({ message: 'Error creating hotel', error: err.message });
    }
  }
];
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

  exports.updateHotel = [
    upload.array('photos', 10), // Utilisation de Multer pour l'upload des fichiers
    async (req, res) => {
      const { id } = req.params;
      const { name, type, city, address, room, description, rating, cheapest_price } = req.body;
  
      // Vérifier si l'utilisateur actuel est un admin
      if (!req.user.isAdmin) {
        return res.status(403).json({ message: "Access denied. Only admins can update hotels." });
      }
  
      try {
        // Vérifier si l'hôtel existe
        const existingHotel = await Hotel.findByPk(id);
        if (!existingHotel) {
          return res.status(404).json({ message: "Hotel not found." });
        }
  
        // Obtenir les chemins des fichiers des photos téléchargées
        const photos = req.files.map(file => file.path);
  
        // Mettre à jour l'hôtel
        const updatedHotel = await existingHotel.update({
          name,
          type,
          city,
          address,
          room,
          photos,
          description,
          rating,
          cheapest_price,
        });
  
        res.status(200).json(updatedHotel);
      } catch (err) {
        res.status(500).json({ message: 'Error updating hotel', error: err.message });
      }
    }
  ];
 
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