const bcrypt = require("bcryptjs");
const User = require("../models/user");

exports.register = async (req, res, next) => {
    try {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);

        const newUser = await User.create({
            ...req.body,
            password: hash,
        });

        res.status(200).send("User has been created");
    } catch (err) {
        next(err);
    }
};
