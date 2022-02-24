const mongoose = require('mongoose');

const works = new mongoose.Schema({
    work_title: String,
    compeny: String,
    position: String,
    start_date: Date,
    duration: Date,
    work_desciption: String,
    work_image: String,
    work_links: Array,
    is_active: Boolean,
})

const worksModel = mongoose.model('works', works);

module.exports = worksModel;