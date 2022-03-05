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
    // let activities = Activities.
    //     find({}).
    //     populate('auths').
    //     exec(function (err, story) {
    //         if (err) return handleError(err);
    //         console.log('The author is %s', story.author.name);
    //         // prints "The author is Ian Fleming"
    //     });
    // console.log({ activities });
    // all = activities;
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