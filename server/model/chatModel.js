const mongoose = require('mongoose');

const chatModel = mongoose.Schema({
    participants: {
        type: Array,
        required: true,
        minLength: 2
    },
    contentChunks: {
        type: Array,
        required: true,
        default: []
    }
});

module.exports = mongoose.model('Chat', chatModel);