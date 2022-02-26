const mongoose = require('mongoose');

const educations = new mongoose.Schema({
    start_year: Date,
    title: String,
    description: String,
    range_years: String,
    compeny_name: String,
    job_type: String,
    is_active: Boolean,
})

const educationsModel = mongoose.model('educations', educations);

module.exports = educationsModel;