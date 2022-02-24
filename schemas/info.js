const mongoose = require('mongoose');

const info = new mongoose.Schema({
    fullname: String,
    email: String,
    bio: String,
    avatar: String,
    social:[ mongoose.Types.ObjectId],
})

const infoModel = mongoose.model('info', info);

module.exports = infoModel;