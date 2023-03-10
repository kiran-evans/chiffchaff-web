const mongoose = require('mongoose');

const userModel = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        minLength: 6
    },
    username: {
        type: String,
        required: true,
        unique: true,
        minLength: 4,
        maxLength: 15
    },
    password: {
        type: String,
        required: true,
    },
    chats: {
        type: Array,
        default: []
    },
    chatRequests: {
        type: Array,
        default: []
    },
    userColor: {
        type: String,
        default: function () {
            var letters = '0123456789ABCDEF';
            var color = '#';
            for (var i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        }
    },
    isArchived: {
        type: Boolean,
        required: true,
        default: false
    }
});

module.exports = mongoose.model('User', userModel);