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
        if (req.query.many) {
            const foundUsers = await User.find({ username: { $regex: req.query.username, $options: 'i' } }, null, { limit: 10 } );
            
            let foundUsersList = [];

            for (const user of foundUsers) {
                if (user._id.toString() === req.query.id) continue;
                const { password, ...userBody } = user._doc;
                foundUsersList.push(userBody);
            };

            return res.status(200).json(foundUsersList);
        }
        
        if (req.query.id) {
            const foundUser = await User.findById(req.query.id);

            if (!foundUser) return res.status(404).json(`No user found.`);

            const { password, ...userBody } = foundUser._doc;
            return res.status(200).json(userBody);
        }

        if (req.body.username) {
            const foundUser = await User.findOne({ username: req.body.username });

            if (!foundUser) return res.status(404).json(`No user found.`);

            const { password, ...userBody } = foundUser._doc;
            return res.status(200).json(userBody);
        }

    } catch (err) {
        return res.status(500).json(`Failed to get user. ${err}`);
    }
}

const updateUser = async (req, res) => {
    try {
        const foundUser = await User.findById(req.query.id);
        if (!foundUser) return res.status(404).json(`No user found.`);
        
        const passwordIsValid = await bcrypt.compare(req.body.password, foundUser.password);
        if (!passwordIsValid) return res.status(400).json(`Invalid password.`);

        let tempBody = { ...req.body };

        if (tempBody.newPassword) {
            const salt = await bcrypt.genSalt(parseInt(process.env.SALT_FACTOR));
            tempBody.password = await bcrypt.hash(tempBody.newPassword, salt);
        } else {
            tempBody.password = foundUser.password; // keep existing encrypted pw in db
        }

        const { newPassword, ...updatedBody } = tempBody; // exclude newPassword field from the submission to the db

        const updatedUser = await User.findByIdAndUpdate(req.query.id, {
            ...updatedBody
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

const loginUser = async (req, res) => {
    try {
        const foundUser = await User.findOne({ username: req.body.username });

        if (!foundUser) return res.status(404).json(`No user found.`);

        const passwordIsValid = await bcrypt.compare(req.body.password, foundUser.password);

        if (!passwordIsValid) return res.status(400).json(`Invalid password.`);

        const { password, ...userBody } = foundUser._doc;
        return res.status(200).json(userBody);

    } catch (err) {
        return res.status(500).json(`Failed to login user. ${err}`);
    }
}

module.exports = {
    createUser,
    getUser,
    updateUser,
    deleteUser,
    loginUser
}