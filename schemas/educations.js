const mongoose = require('mongoose');

const educations = new mongoose.Schema({
    start_year: Date,
    graduation_year: Date,
    title: String,
    description: String,
    unviersity_name: String,
    is_active: Boolean,
    deleted: Boolean
})

const educationsModel = mongoose.model('educations', educations);

module.exports = educationsModel;