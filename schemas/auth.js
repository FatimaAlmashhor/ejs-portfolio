const mongoose = require('mongoose');

const auth = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    fullname: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    premitions:{
        type :Array ,
        default:['all'] ,
    },
    auth_role: {
        type: Number,
        required: true,
        default: 1 // 1 for normal sub admin , 0 admin   
    },
    is_active: Boolean,
    deleted: Boolean
})

const authModel = mongoose.model('auth', auth);

module.exports = authModel;