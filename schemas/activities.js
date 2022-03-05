const mongoose = require('mongoose');

const actions = new mongoose.Schema({
    table_name: {
        type: String,
        required: true
    },
    row_id: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    auth_id: {
        type: mongoose.Types.ObjectId,
        ref: 'auths',
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