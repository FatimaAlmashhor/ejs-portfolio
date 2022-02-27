const route = require('express').Router()
const Experiences = require('../schemas/experiences')
const ejs = require('ejs')
const verify = require('../middlewares/verifyToken')
const removeFile = require('../utils/js/removeFile')
const upload = require('../utils/js/multer')
var all = [];

route.get('/', verify, async (req, res) => {
    var experiences = await Experiences.find().clone().catch(function (err) { console.log(err) });
    all = experiences;
    res.render('dashboard', {
        currentPage: 'experiences',
        data: all,
        formInfo: {}
    })
    console.log('here the experiences');
});

route.post('/', verify, upload.single('project'), async (req, res) => {
    try {

        await new Experiences({
            title: req.body.title,
            description: req.body.des,
            start_year: req.body.start_year,
            range_years: req.body.range_years,
            company_name: req.body.company_name,
            job_type: req.body.job_type,
            is_active: true,
            deleted: false
        }).save((err, result) => {
            if (err) {
                console.log(err);
                removeFile("./uploads/experiences/" + req.file.filename)
                return res.redirect('/500page');
            }
            else {
                all.push(result)
                res.redirect('/dashboard/experiences')
                res.end()
            }
        })

    } catch (error) {
        console.log({ error });
    }
});
route.get('/delete/:id', async (req, res) => {
    try {
        await Experiences.updateOne({
            _id: req.params.id.replace(/ /g, "")
        },
            {
                deleted: true,
            },
            (error, result) => {
                if (error) console.log({ error });
                else {
                    res.redirect('/dashboard/experiences')
                    res.end()
                }
            }).clone()


    } catch (error) {
        console.log({ error });
    }
});
route.get('/toggle/:id/', async (req, res) => {
    try {
        const newLocal = req.query.state ? false : true
        console.log(newLocal);
        await Experiences.updateOne({
            _id: req.params.id.replace(/ /g, "")
        },
            {
                is_active: (newLocal)
            },
            (error, result) => {
                if (error) console.log({ error });
                else {

                    res.redirect('/dashboard/experiences')
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
        await Experiences.findById(req.params.id.replace(/ /g, ""), (err, result) => {
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
        await Experiences.updateOne({
            _id: req.body.id.replace(/ /g, "")
        },
            {
                title: req.body.title,
                description: req.body.des,
                position: req.body.position,
                role: req.body.role,
                image: req.file !== undefined ? req.file.filename : null,
                links: [{ live: req.body.liveLink }],
            },
            (error, result) => {
                if (error) console.log({ error });
                else {
                    res.redirect('/dashboard/experiences')
                    res.end()
                }
            }).clone()

    } catch (error) {
        console.log({ error });
    }
});






module.exports = route