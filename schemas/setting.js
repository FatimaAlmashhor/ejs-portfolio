const mongoose = require('mongoose');

const setting = new mongoose.Schema({
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

const settingModel = mongoose.model('setting', setting);

module.exports = settingModel;