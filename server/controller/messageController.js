const Message = require('../model/messageModel');

const createMessage = async (req, res) => {
    try {

    } catch (err) {
        return res.status(500).json(`Failed to create message. ${err}`);
    }
}

const getMessage = async (req, res) => {
    try {
        const foundMessage = await Message.findById(req.query.id);

        if (!foundMessage) return res.status(404).json(`No message found.`);

        return res.status(200).json(foundMessage._doc);

    } catch (err) {
        return res.status(500).json(`Failed to get message. ${err}`);
    }
}

const updateMessage = async (req, res) => {
    try {

    } catch (err) {
        return res.status(500).json(`Failed to update message. ${err}`);
    }
}

const deleteMessage = async (req, res) => {
    try {
        const foundMessage = await Message.findById(req.query.id);

        if (!foundMessage) return res.status(404).json(`No message found.`);

        await foundMessage.remove();

        return res.status(204).send();

    } catch (err) {
        return res.status(500).json(`Failed to delete message. ${err}`);
    }
}

module.exports = {
    createMessage,
    getMessage,
    updateMessage,
    deleteMessage
}