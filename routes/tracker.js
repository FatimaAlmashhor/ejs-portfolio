const route = require('express').Router()
const Activities = require('../schemas/activities')
const Auth = require('../schemas/auth')
const ejs = require('ejs')
const verify = require('../middlewares/verifyToken')
const removeFile = require('../utils/js/removeFile')
const upload = require('../utils/js/multer')
var all = [];

route.get('/', verify, async (req, res) => {
    var activities = await Activities.find({ deleted: false }).clone().catch(function (err) { console.log(err) });
    var auth = await Auth.find()
    all = activities;
    let user = req.cookies.auth;
    res.render('dashboard', {
        currentPage: 'tracker',
        data: all,
        formInfo: {},
        userInfo: { name: user.fullname, role: user.auth_role }
    })
    console.log('here the activities');
});

module.exports = route