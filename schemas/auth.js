const mongoose = require('mongoose');

const auth = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    fullname: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    is_active: Boolean,
    deleted: Boolean
})

const authModel = mongoose.model('auth', auth);

module.exports = authModel;