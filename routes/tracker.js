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
    let newActivationObject = await activities.map(element => {
        let result = Auth.findOne({ _id: element.auth_id })
            .exec()
            .then(result => {
                let finalResult = {
                    data: element,
                    auth: result
                }
                return new Promise(resolve => resolve(finalResult));
            })
            .catch(err => {
                console.log(err);
                res.redirect('500page')
            })
        return result
    })
    let givemetry = Promise.all(newActivationObject);

    givemetry.then(r => {
        all = r
    })

    let user = req.cookies.auth;
    res.render('dashboard', {
        currentPage: 'tracker',
        activities: true,
        data: all,
        formInfo: {},
        userInfo: { name: user.fullname, role: user.auth_role }
    })
    console.log('here the activities');
});
route.get('/members', verify, async (req, res) => {
    var auths = await Auth.find({ auth_role: 1 }).clone().catch(function (err) { console.log(err) });

    let user = req.cookies.auth;
    res.render('dashboard', {
        currentPage: 'tracker',
        activities: false,
        data: auths,
        formInfo: {},
        userInfo: { name: user.fullname, role: user.auth_role }
    })
    console.log('here the activities');
});

module.exports = route