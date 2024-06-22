const User = require("../models/user")


exports.getUsers= async (req, res, next) => {
    try{
        const users = await User.findAll()
        res.status(200).json(users);
    }catch (err){
       next(err);
    }
}