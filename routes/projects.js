const route = require('express').Router()
const projects = require('../schemas/projects')
const ejs = require('ejs')
const verify = require('../middlewares/verifyToken')
var all = [];

route.get('/', verify, async (req, res) => {
    var projects = await projects.find().clone().catch(function (err) { console.log(err) });
    all = projects;
    res.render('dashboard', {
        currentPage: 'projects',
        data: all,
        formInfo: {}
    })
    console.log('here the projects');
});

route.post('/', async (req, res) => {
    try {
        console.log(req.body);
        await new projects({
            title: req.body.title,
            description: req.body.des,
            position : req.body.position ,
            role : req.body.role ,
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
                    currentPage: 'projects',
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
        await projects.updateOne({
            _id: req.params.id.replace(/ /g, "")
        },
            {
                deleted: true,
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
route.get('/toggle/:id/', async (req, res) => {
    try {
        let newState = (req.query.state) == true ? false : true;
        console.log({ newState });
        await projects.updateOne({
            _id: req.params.id.replace(/ /g, "")
        },
            {
                is_active: newState
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
        await projects.findById(req.params.id.replace(/ /g, ""), (err, result) => {
            if (!err) {

                res.json({
                    formInfo: {
                        title: result.projects_title,
                        des: result.projects_description,
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
        await projects.updateOne({
            _id: req.params.id.replace(/ /g, "")
        },
            {
                projects_title: req.query.title,
                projects_description: req.query.des
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






module.exports = route