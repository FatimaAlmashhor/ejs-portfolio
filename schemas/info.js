const mongoose = require('mongoose');

const info = new mongoose.Schema({
    bio: {
        type: String,
    },
    cv: {
        type: String,
    },
    about: String,
    progress: Array,
    is_active: Boolean,
    deleted: Boolean
})

const infoModel = mongoose.model('info', info);

module.exports = infoModel;