const mongoose = require('mongoose');

const expreinces = new mongoose.Schema({
    title: String,
    description: String,
    range_years: String,
    compeny_name: String,
    job_type: String,
    is_active: Boolean,
    deleted: Boolean
})

const expreincesModel = mongoose.model('expreinces', expreinces);

module.exports = expreincesModel;