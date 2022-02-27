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

services.index({ services_title: 1, deleted: 1 }, { unique: true })

const servicesModel = mongoose.model('services', services);

module.exports = servicesModel;