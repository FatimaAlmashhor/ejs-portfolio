const mongoose = require('mongoose');

const projects = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    desciption: String,
    position :String ,
    role : String ,
    links: Array,
    image: String,
    is_active: Boolean,
    deleted: Boolean
})

const projectsModel = mongoose.model('projects', projects);

module.exports = projectsModel;