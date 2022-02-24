const mongoose = require('mongoose');

const services = new mongoose.Schema({
    services_title: String,
    services_description: String,
    is_active: Boolean,
})

const servicesModel = mongoose.model('services', services);

module.exports = servicesModel;