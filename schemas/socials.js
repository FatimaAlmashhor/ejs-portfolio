const mongoose = require('mongoose');

const social = new mongoose.Schema({
    social_title: String,
    social_link: String,
    is_active: Boolean,
})

const socialModel = mongoose.model('social', social);

module.exports = socialModel