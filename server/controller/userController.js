const bcrypt = require('bcrypt');
const User = require('../model/userModel');

const createUser = async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(parseInt(process.env.SALT_FACTOR));
        const hashedPw = await bcrypt.hash(req.body.password, salt);

        const newUser = new User({
            email: req.body.email,
            username: req.body.username,
            password: hashedPw
        });

        await newUser.save();

        return res.status(201).json(newUser);

    } catch (err) {
        return res.status(500).json(`Failed to create user. ${err}`);
    }
}

const getUser = async (req, res) => {
    try {
        const foundUser = await User.findById(req.query.id);

        if (!foundUser) return res.status(404).json(`No user found.`);

        const { password, ...userBody } = foundUser._doc;
        return res.status(200).json(userBody);

    } catch (err) {
        return res.status(500).json(`Failed to get user. ${err}`);
    }
}

const updateUser = async (req, res) => {
    try {
        const foundUser = await User.findById(req.query.id);

        if (!foundUser) return res.status(404).json(`No user found.`);

        const updatedUser = await User.findByIdAndUpdate(req.query.id, {
            ...req.body
        }, { new: true });

        const { password, ...userBody } = updatedUser._doc;
        return res.status(200).json(userBody);

    } catch (err) {
        return res.status(500).json(`Failed to update user. ${err}`);
    }
}

const deleteUser = async (req, res) => {
    try {
        const foundUser = await User.findById(req.query.id);

        if (!foundUser) return res.status(404).json(`No user found.`);

        await foundUser.remove();

        return res.status(204).send();

    } catch (err) {
        return res.status(500).json(`Failed to delete user. ${err}`);
    }
}

module.exports = {
    createUser,
    getUser,
    updateUser,
    deleteUser
}