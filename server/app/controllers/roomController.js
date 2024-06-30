const Hotel = require('../models/Hotel');
const Room = require('../models/Room');

exports.createRoom = async (req, res) => {
    const { currentUserAdmin } = req.body;
    const hotelId = req.params.hotelId;
    const { title, price, max_people, description, room_numbers } = req.body;
  
    try {
      if (!currentUserAdmin) {
        return res.status(403).json({ message: "Accès refusé. Seuls les administrateurs peuvent créer des chambres." });
      }
  
      const hotel = await Hotel.findByPk(hotelId);
      if (!hotel) {
        return res.status(404).json({ message: 'Hôtel non trouvé' });
      }
  
      const newRoom = await Room.create({
        title,
        price,
        max_people,
        description,
        room_numbers,
        hotel_id: hotelId,
      });
  
      res.status(201).json(newRoom);
    } catch (error) {
      console.error("Erreur lors de la création de la chambre :", error);
      res.status(500).json({ message: 'Erreur lors de la création de la chambre', error: error.message });
    }
  };

  exports.getAllRooms = async (req, res) => {
    try {
      const rooms = await Room.findAll({
        include: [Hotel]
      });
      res.status(200).json(rooms);
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération des chambres', error: error.message });
    }
  };

  exports.getRoomById = async (req, res) => {
    const roomId = req.params.id;
  
    try {
      const room = await Room.findByPk(roomId, {
        include: [
          {
            model: Hotel,
            attributes: ['name'] // Inclure seulement le nom de l'hôtel
          }
        ]
      });
  
      if (!room) {
        return res.status(404).json({ message: 'Chambre non trouvée' });
      }
  
      res.status(200).json(room);
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération de la chambre', error: error.message });
    }
  };
  
exports.updateRoom = async (req, res) =>{
    const roomId = req.params.id;
    const { title, price, max_people, description, room_numbers } = req.body;
  
    try {
      const room = await Room.findByPk(roomId);
  
      if (!room) {
        return res.status(404).json({ message: 'Chambre non trouvée' });
      }
  
      // Vérification si l'utilisateur est admin
      if (!req.body.currentUserAdmin) {
        return res.status(403).json({ message: "Accès refusé. Seuls les administrateurs peuvent mettre à jour des chambres." });
      }
  
      // Mettre à jour les données de la chambre
      room.title = title;
      room.price = price;
      room.max_people = max_people;
      room.description = description;
      room.room_numbers = room_numbers;
  
      await room.save();
  
      res.status(200).json(room);
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la mise à jour de la chambre', error: error.message });
    }
}


exports.deleteRoom = async  (req, res) =>{
    const roomId = req.params.id;
    try{
        const room = await  Room.findByPk(roomId);

        if(!room){
            return res.status(404).json({message: 'chambre non trouvée'})
        }
        if(!req.body.currentUserAdmin){
            return res.status(403).json({ message: "Accès refusé. Seuls les administrateurs peuvent supprimer des chambres."})
        }
        await room.destroy();

        res.status(200).json({message: 'chambre supprimée avec success'});
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la suppression de la chambre', error: error.message });
    }
}