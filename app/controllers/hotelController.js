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
    try{
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
        res.status(201).json(newHotel)

    } catch (err){
        res.status(500).json({ message: 'Erreur lors de la création de l\'hôtel', error: err.message });

    }
}

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
    try{
        const hotel = await Hotel.findByPk(id);
        if(!hotel){
                return res.status(404).json({ message : 'hotel non trouvé'})
        }
        await hotel.destroy();
        res.status(200).json({ message: 'Hôtel supprimé avec succès' });

    } catch (err){
        res.status(500).json({ message: 'Erreur lors de la suppression de l\'hôtel', error: err.message });
    }
}

 
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