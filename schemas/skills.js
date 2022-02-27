const mongoose = require('mongoose');

const skills = new mongoose.Schema({
    skill_name: {
        type: String,
        // unique: true,
        required: true
    },
    skill_type: String, // progamming , soft skills and so on 
    is_active: Boolean,
    deleted: Boolean
})


skills.index({ skill_name: 1, deleted: 1 }, { unique: true })

const skillsModel = mongoose.model('skills', skills);

module.exports = skillsModel;