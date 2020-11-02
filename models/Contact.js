const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    seen: {
        type: String,
        default: 'no',
        enum: ['no', 'yes']
    }
})

module.exports = mongoose.model('Contact', ContactSchema)