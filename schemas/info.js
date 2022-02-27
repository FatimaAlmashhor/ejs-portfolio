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
    editTime: Date,
    userEdit: String
})

const infoModel = mongoose.model('info', info);

module.exports = infoModel;