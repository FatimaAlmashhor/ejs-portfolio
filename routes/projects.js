const route = require('express').Router()
const Projects = require('../schemas/projects')
const ejs = require('ejs')
const Activities = require('../schemas/activities')
const mongoose = require('mongoose')
const verify = require('../middlewares/verifyToken')
const removeFile = require('../utils/js/removeFile')
const upload = require('../utils/js/multer')
var all = [];

route.get('/', verify, async (req, res) => {
    var projects = await Projects.find().clone({ deleted: false }).catch(function (err) { console.log(err) });
    all = projects;
    let user = req.cookies.auth;
    res.render('dashboard', {
        currentPage: 'projects',
        data: all,
        formInfo: {},
        userInfo: { name: user.fullname, role: user.auth_role }
    })
    console.log('here the projects');
});

route.post('/', verify, upload.single('project'), async (req, res) => {
    try {

        await new Projects({
            title: req.body.title,
            description: req.body.des,
            position: req.body.position,
            role: req.body.role,
            image: req.file !== undefined ? req.file.filename : null,
            links: [{ live: req.body.liveLink }],
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
                    table_name: 'projects',
                    row_id: mongoose.Types.ObjectId(result.id),
                    auth_id: mongoose.Types.ObjectId(req.cookies.auth._id),
                    actions_type: 1,
                    actions_time: new Date()
                }).save((err, result) => {
                    if (err) return res.redirect('/500page');
                })
                all.push(result)
                res.redirect('/dashboard/projects')
                res.end()
            }
        })

    } catch (error) {
        console.log({ error });
    }
});
route.get('/delete/:id', async (req, res) => {
    try {
        await Projects.findByIdAndUpdate({
            _id: req.params.id.replace(/ /g, "")
        },
            {
                deleted: true,
            }).exec()
            .then(result => {
                Activities({
                    table_name: 'projects',
                    row_id: mongoose.Types.ObjectId(result.id),
                    auth_id: mongoose.Types.ObjectId(req.cookies.auth._id),
                    actions_type: 3,
                    actions_time: new Date()
                }).save((err, result) => {
                    if (err) return res.redirect('/500page');
                })

                res.redirect('/dashboard/projects')
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
        let doc = await Projects.findOne(filter, (error, result) => {
            if (error) return res.redirect('500page');
            else {
                Activities({
                    table_name: 'projects',
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

        await Projects.updateOne(filter,
            {
                is_active: newLocal
            },
            (error, result) => {
                if (error) console.log({ error });
                else {

                    res.redirect('/dashboard/projects')
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
        await Projects.findById(req.params.id.replace(/ /g, ""), (err, result) => {
            if (!err) {

                res.json({
                    formInfo: {
                        id: result.id,
                        title: result.title,
                        des: result.description,
                        position: result.position,
                        role: result.role,
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

        console.log('[body]', req.body);
        await Projects.findByIdAndUpdate({
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
                    table_name: 'projects',
                    row_id: mongoose.Types.ObjectId(result.id),
                    auth_id: mongoose.Types.ObjectId(req.cookies.auth._id),
                    actions_type: 2,
                    actions_time: new Date()
                }).save((err, result) => {
                    if (err) return res.redirect('/500page');
                })

                res.redirect('/dashboard/projects')
                res.end()

            }).catch(error => {
                console.log({ error });
            })

    } catch (error) {
        console.log({ error });
    }
});






module.exports = route