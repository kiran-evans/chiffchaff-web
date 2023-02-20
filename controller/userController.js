const bcrypt = require('bcrypt');
const User = require('../model/userModel');
const Chat = require('../model/chatModel');

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
                if (user._id.toString() === req.query.id || user.isArchived) continue;
                const { email, password, chats, chatRequests, __v, ...userBody } = user._doc;
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

        if (tempBody.newPassword) { // user is changing their pw
            const salt = await bcrypt.genSalt(parseInt(process.env.SALT_FACTOR));
            tempBody.password = await bcrypt.hash(tempBody.newPassword, salt);
        } else { // user changing something else
            tempBody.password = foundUser.password; // keep existing encrypted pw in db

            if (req.query.reset) {
                for await (const chatId of foundUser.chats) {
                    const foundChat = await Chat.findById(chatId);
                    let tempChat = { ...foundChat._doc };

                    tempChat.participants[tempChat.participants.indexOf(foundUser._id.toString())] = null; // remove user details from chat

                    for await (let message of tempChat.messages) {
                        if (message.senderId.toString() === foundUser._id.toString()) {
                            if (req.query.deleteFromOthers === "true") { // delete user's messages from all chats
                                message.body = null;
                            }
                            message.senderId = null;
                        }
                    }

                    await Chat.findByIdAndUpdate(chatId, {
                        ...tempChat,
                        lastModified: Date()
                    });
                    tempBody.chats = [];
                    tempBody.isArchived = false;
                }
            }
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

        if (req.query.deleteFromOthers === "true") {
            for await (const chatId of foundUser.chats) {
                const foundChat = await Chat.findById(chatId);
                let tempChat = { ...foundChat._doc };

                for await (let message of tempChat.messages) {
                    if (message.senderId === foundUser._id.toString()) {
                        message.body = null;
                        message.senderId = null;
                    }
                }

                await Chat.findByIdAndUpdate(chatId, {
                    ...tempChat,
                    lastModified: Date()
                });
            }
        }

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