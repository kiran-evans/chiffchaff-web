const Chat = require('../model/chatModel');

const createChat = async (req, res) => {
    try {

    } catch (err) {
        return res.status(500).json(`Failed to create chat. ${err}`);
    }
}

const getChat = async (req, res) => {
    try {
        const foundChat = await Chat.findById(req.query.id);
        if (!foundChat) return res.status(404).json(`No chat found.`);

        return res.status(200).json(foundChat._doc);
                
    } catch (err) {
        return res.status(500).json(`Failed to get chat. ${err}`);
    }
}

const updateChat = async (req, res) => {
    try {

    } catch (err) {
        return res.status(500).json(`Failed to update chat. ${err}`);
    }
}

const deleteChat = async (req, res) => {
    try {
        const foundChat = await Chat.findById(req.query.id);

        if (!foundChat) return res.status(404).json(`No chat found.`);

        await foundChat.remove();

        return res.status(204).send();

    } catch (err) {
        return res.status(500).json(`Failed to delete chat. ${err}`);
    }
}

module.exports = {
    createChat,
    getChat,
    updateChat,
    deleteChat
}