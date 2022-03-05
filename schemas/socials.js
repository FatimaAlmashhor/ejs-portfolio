const mongoose = require('mongoose');

const social = new mongoose.Schema({
    social_title: String,
    social_link: String,
    social_icon: String,
    is_active: Boolean,
    deleted: Boolean
})

const socialModel = mongoose.model('social', social);
social.index({ social_title: 1, deleted: 1 }, { unique: true })
module.exports = socialModel