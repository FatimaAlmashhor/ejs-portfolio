const route = require('express').Router()
const Educations = require('../schemas/educations')
const Activities = require('../schemas/activities')
const ejs = require('ejs')
const mongoose = require('mongoose')
const verify = require('../middlewares/verifyToken')
const removeFile = require('../utils/js/removeFile')
const checkActivationUser = require('../middlewares/checkActivationUser')
const upload = require('../utils/js/multer')
var all = [];

route.get('/', verify, checkActivationUser, async (req, res) => {
    var educations = await Educations.find({ deleted: false }).clone().catch(function (err) { console.log(err) });
    all = educations;
    let user = req.cookies.auth;
    res.render('dashboard', {
        currentPage: 'educations',
        data: all,
        formInfo: {},
        userInfo: { name: user.fullname, role: user.auth_role }
    })
    console.log('here the Educations');
});

route.post('/', verify, upload.single('project'), async (req, res) => {
    try {

        await new Educations({
            title: req.body.title,
            description: req.body.des,
            start_year: req.body.start_year,
            graduation_year: req.body.graduation_year,
            unviersity_name: req.body.unviersity_name,

            is_active: true,
            deleted: false
        }).save((err, result) => {
            if (err) {
                console.log(err);
                removeFile("./uploads/projects/" + req.file.filename)
                return res.redirect('/500page');
            }
            else {
                Activities({
                    table_name: 'education',
                    row_id: mongoose.Types.ObjectId(result.id),
                    auth_id: mongoose.Types.ObjectId(req.cookies.auth._id),
                    actions_type: 1,
                    actions_time: new Date()
                }).save((err, result) => {
                    if (err) return res.redirect('/500page');
                })
                all.push(result)
                res.redirect('/dashboard/educations')
                res.end()
            }
        })

    } catch (error) {
        console.log({ error });
    }
});
route.get('/delete/:id', async (req, res) => {
    try {

        await Educations.findByIdAndUpdate({
            _id: req.params.id.replace(/ /g, "")
        },
            {
                deleted: true,
            }).exec()
            .then(result => {
                Activities({
                    table_name: 'education',
                    row_id: mongoose.Types.ObjectId(result.id),
                    auth_id: mongoose.Types.ObjectId(req.cookies.auth._id),
                    actions_type: 3,
                    actions_time: new Date()
                }).save((err, result) => {
                    if (err) return res.redirect('/500page');
                })

                res.redirect('/dashboard/educations')
                res.end()

            }).catch(error => {
                console.log({ error });
            })


    } catch (error) {
        console.log({ error });
    }
});
route.get('/toggle/:id/', async (req, res) => {
    try {
        const filter = {
            _id: req.params.id.replace(/ /g, "")
        }
        let doc = await Educations.findOne(filter, (error, result) => {
            if (error) return res.redirect('500page');
            else {
                Activities({
                    table_name: 'education',
                    row_id: mongoose.Types.ObjectId(result.id),
                    auth_id: mongoose.Types.ObjectId(req.cookies.auth._id),
                    actions_type: 2,
                    actions_time: new Date()
                }).save((err, result) => {
                    if (err) return res.redirect('/500page');
                })
            }
        }).clone();
        const newLocal = doc.is_active ? false : true
        console.log(newLocal);

        await Educations.updateOne(filter,
            {
                is_active: newLocal
            },
            (error, result) => {
                if (error) console.log({ error });
                else {

                    res.redirect('/dashboard/educations')
                    res.end()
                }
            }).clone()

    } catch (error) {
        console.log({ error });
    }
});

// get one only 
route.get('/:id', async (req, res) => {
    try {
        await Educations.findById(req.params.id.replace(/ /g, ""), (err, result) => {
            if (!err) {
                // start_year: Date,
                // graduation_year: Date,
                // title: String,
                // description: String,
                // unviersity_name: String,
                // is_active: Boolean,
                // deleted: Boolean
                res.json({
                    formInfo: {
                        id: result.id,
                        title: result.title,
                        des: result.description,
                        unviersity_name: result.unviersity_name,
                        start_year: result.start_year,
                        graduation_year: result.start_year,
                    }
                })
            }
        }).clone()


    } catch (error) {
        console.log(error);
    }
});
route.post('/edit', verify, upload.single('project'), async (req, res) => {
    try {

        await Educations.findByIdAndUpdate({
            _id: req.body.id.replace(/ /g, "")
        },
            {
                title: req.body.title,
                description: req.body.des,
                position: req.body.position,
                role: req.body.role,
                image: req.file !== undefined ? req.file.filename : null,
                links: [{ live: req.body.liveLink }],
            }).exec()
            .then(result => {
                Activities({
                    table_name: 'education',
                    row_id: mongoose.Types.ObjectId(result.id),
                    auth_id: mongoose.Types.ObjectId(req.cookies.auth._id),
                    actions_type: 2,
                    actions_time: new Date()
                }).save((err, result) => {
                    if (err) return res.redirect('/500page');
                })

                res.redirect('/dashboard/educations')
                res.end()

            }).catch(error => {
                console.log({ error });
            })


    } catch (error) {
        console.log({ error });
    }
});






module.exports = route