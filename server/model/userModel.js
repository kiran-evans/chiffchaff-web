import mongoose from 'mongoose';

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
    }
});

module.exports = mongoose.model('User', userModel);