const req = require('express/lib/request');
const mongoose = require('mongoose');

const services = new mongoose.Schema({
    services_title: {
        type: String,
        required: true,
        // unique: true
    },
    services_description: String,
    is_active: Boolean,
    deleted: Boolean
})

const servicesModel = mongoose.model('services', services);

module.exports = servicesModel;