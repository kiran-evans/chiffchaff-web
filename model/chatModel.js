const mongoose = require('mongoose');

const chatModel = mongoose.Schema({
    participants: {
        type: Array,
        required: true,
        minLength: 2
    },
    messages: {
        type: Array,
        required: true,
        default: []
    },
    lastModified: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model('Chat', chatModel);