const route = require('express').Router()
const Services = require('../schemas/services')
const Activities = require('../schemas/activities')
const mongoose = require('mongoose')
const ejs = require('ejs')
const verify = require('../middlewares/verifyToken')
var all = [];

route.get('/', verify, async (req, res) => {
    var services = await Services.find({ deleted: false }).clone().catch(function (err) { console.log(err) });
    all = services;
    let user = req.cookies.auth;
    res.render('dashboard', {
        currentPage: 'services',
        data: all,
        formInfo: {},
        userInfo: { name: user.fullname, role: user.auth_role }
    })
    console.log('here the all');
});

route.post('/', async (req, res) => {
    try {
        console.log(req.body);
        await new Services({
            services_title: req.body.title,
            services_description: req.body.des,
            is_active: true,
            deleted: false
        }).save((err, result) => {
            if (err) {
                console.log(err);
                return res.redirect('/500page')
            }
            else {
                Activities({
                    table_name: 'services',
                    row_id: mongoose.Types.ObjectId(result.id),
                    auth_id: mongoose.Types.ObjectId(req.cookies.auth._id),
                    actions_type: 1,
                    actions_time: new Date()
                }).save((err, result) => {
                    if (err) return res.redirect('/500page');
                })
                all.push(result)
                let user = req.cookies.auth;
                res.render('dashboard', {
                    currentPage: 'services',
                    data: all,
                    formInfo: {},
                    userInfo: { name: user.fullname, role: user.auth_role }
                })
                res.end()
            }
        })

    } catch (error) {
        console.log({ error });
    }
});
route.get('/delete/:id', async (req, res) => {
    try {
        await Services.findByIdAndUpdate({
            _id: req.params.id.replace(/ /g, "")
        },
            {
                deleted: true,
            }).exec()
            .then(result => {
                Activities({
                    table_name: 'services',
                    row_id: mongoose.Types.ObjectId(result.id),
                    auth_id: mongoose.Types.ObjectId(req.cookies.auth._id),
                    actions_type: 3,
                    actions_time: new Date()
                }).save((err, result) => {
                    if (err) return res.redirect('/500page');
                })

                res.redirect('/dashboard/services')
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
        let doc = await Services.findOne(filter, (error, result) => {
            if (error) return res.redirect('500page');
            else {
                Activities({
                    table_name: 'services',
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

        await Services.updateOne(filter,
            {
                is_active: newLocal
            },
            (error, result) => {
                if (error) console.log({ error });
                else {

                    res.redirect('/dashboard/services')
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
        await Services.findById(req.params.id.replace(/ /g, ""), (err, result) => {
            if (!err) {

                res.json({
                    formInfo: {
                        id: result._id,
                        title: result.services_title,
                        des: result.services_description,
                    }
                })
            }
        }).clone()


    } catch (error) {
        console.log(error);
    }
});
route.post('/edit/', async (req, res) => {
    try {
        console.log('[body]', req.body);
        await Services.findByIdAndUpdate({
            _id: req.body.id.replace(/ /g, "")
        },
            {
                services_title: req.body.title,
                services_description: req.body.des,
            }).exec()
            .then(result => {
                Activities({
                    table_name: 'services',
                    row_id: mongoose.Types.ObjectId(result.id),
                    auth_id: mongoose.Types.ObjectId(req.cookies.auth._id),
                    actions_type: 2,
                    actions_time: new Date()
                }).save((err, result) => {
                    if (err) return res.redirect('/500page');
                })

                res.redirect('/dashboard/services')
                res.end()

            }).catch(error => {
                console.log({ error });
            })


    } catch (error) {
        console.log({ error });
    }
});






module.exports = route