const mongoose = require('mongoose');

const actions = new mongoose.Schema({
    table_name: {
        type: String,
        required: true
    },
    row_id: {
        type: String,
        required: true
    },
    auth_id: {
        type: String,
        required: true
    },
    actions_type: {
        type: Number, // 1 add , 2 edit , 3 delete
        required: true
    },
    actions_time: Date
})

const actionsModel = mongoose.model('actions', actions);

module.exports = actionsModel;