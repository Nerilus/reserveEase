const Room = require('../models/Room');

exports.createRoom = async (req, res) => {
  if (!req.body.currentUserAdmin) {
    return res.status(403).json({ message: "Accès refusé. Seuls les administrateurs peuvent créer des chambres." });
  }
  const { title, price, max_people, description, room_numbers } = req.body;
  try {
    const newRoom = await Room.create({
      title,
      price,
      max_people,
      description,
      room_numbers
    });
    res.status(201).json(newRoom);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création de la chambre', error: error.message });
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