const mongoose = require('mongoose');

const messageModel = mongoose.Schema({
    senderId: {
        type: String,
        required: true
    },
    dateSent: {
        type: Date,
        required: true
    },
    body: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Message', messageModel);