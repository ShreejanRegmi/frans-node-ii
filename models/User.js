const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        lowercase: true
    },
    fullName: {
        type: String,
        required: true
    },
    encryptedPassword: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('User', UserSchema)