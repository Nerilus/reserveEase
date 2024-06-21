const bcrypt = require("bcryptjs");
const User = require("../models/user");
const { createError } = require("../utils/error");
const jwt = require("jsonwebtoken")

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


exports.login = async (req, res, next) => {
    try {
        const user = await User.findOne({ where: { username: req.body.username } });
        if (!user) return next(createError(404, "User not found"));

        const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);
        if (!isPasswordCorrect) return next(createError(400, "Wrong password or username"));

        const token = jwt.sign(
            { id: user.id, isAdmin: user.is_admin },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        const { password, is_admin, ...otherDetails } = user.toJSON();
        res
            .cookie("access_token", token, {
                httpOnly: true,
            })
            .status(200)
            .json({ details: { ...otherDetails }, isAdmin: is_admin });
    } catch (err) {
        next(err);
    }
};
