const route = require('express').Router()
const Services = require('../schemas/services')
const ejs = require('ejs')
const verify = require('../middlewares/verifyToken')
var all = [];

route.get('/', verify, async (req, res) => {
    var services = await Services.find({ deleted: false }).clone().catch(function (err) { console.log(err) });
    all = services;
    let user = req.cookies.auth;
    console.log('[user in servies]', user);
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
                all.push(result)
                res.render('dashboard', {
                    currentPage: 'services',
                    data: all,
                    formInfo: {}
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
        await Services.updateOne({
            _id: req.params.id.replace(/ /g, "")
        },
            {
                deleted: true,
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
route.get('/toggle/:id/', async (req, res) => {
    try {
        const filter = {
            _id: req.params.id.replace(/ /g, "")
        }
        let doc = await Services.findOne(filter, (error) => {
            if (error) return res.redirect('500page')
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
route.get('/edit/:id/', async (req, res) => {
    try {

        console.log('[body]', req.query.skillName);
        await Services.updateOne({
            _id: req.params.id.replace(/ /g, "")
        },
            {
                services_title: req.query.title,
                services_description: req.query.des
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






module.exports = route