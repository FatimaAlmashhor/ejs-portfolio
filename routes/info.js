const route = require('express').Router()
const Info = require('../schemas/info')
const ejs = require('ejs')
const verify = require('../middlewares/verifyToken')
const removeFile = require('../utils/js/removeFile')
const upload = require('../utils/js/multer')
const { restart } = require('nodemon')
var all = [];

route.get('/', verify, async (req, res) => {
    var info = await Info.find({ deleted: false }).clone().catch(function (err) { console.log(err) });
    all = info;
    let user = req.cookies.auth;
    res.render('dashboard', {
        currentPage: 'info',
        data: all,
        formInfo:{},
        userInfo: { name: user.fullname, role: user.auth_role }
    })
    console.log('here the info');
});

route.post('/', verify, upload.single('cv'), async (req, res) => {
    try {

        await new Info({
            bio: req.body.bio,
            about: req.body.about,
            cv: req.file !== undefined ? req.file.filename : null,
            is_active: true,
            deleted: false
        }).save((err, result) => {
            if (err) {
                console.log(err);
                removeFile("./uploads/info/" + req.file.filename)
                return res.redirect('/500page');
            }
            else {
                all.push(result)
                res.redirect('/dashboard/info')
                res.end()
            }
        })

    } catch (error) {
        console.log({ error });
    }
});
route.get('/delete/:id', async (req, res) => {
    try {
        await Info.updateOne({
            _id: req.params.id.replace(/ /g, "")
        },
            {
                deleted: true,
            },
            (error, result) => {
                if (error) console.log({ error });
                else {
                    res.redirect('/dashboard/info')
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
        await Info.updateOne({
            _id: req.params.id.replace(/ /g, "")
        },
            {
                is_active: (newLocal)
            },
            (error, result) => {
                if (error) console.log({ error });
                else {

                    res.redirect('/dashboard/info')
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
        console.log('[id]', req.params.id.replace(/ /g, ""));
        await Info.findById(req.params.id.replace(/ /g, ""), (err, result) => {
            if (!err) {

                res.json({
                    formInfo: {
                        id: result.id,
                        bio: result.bio,
                        about: result.about,
                    }
                })
            }
            else {
                console.log({ erro });
                res.redirect('/500page')
            }
        }).clone()


    } catch (error) {
        console.log(error);
    }
});

// edit
route.post('/edit', verify, async (req, res) => {
    try {
        console.log('[body]', req.body);
        await Info.updateOne({
            _id: req.body.id.replace(/ /g, "")
        },
            {
                bio: req.body.bio,
                about: req.body.about,
                // cv: req.file !== undefined ? req.file.filename : null,
            },
            (error, result) => {
                if (error) {
                    console.log({ error });
                    res.redirect('/500page')
                }
                else {
                    res.redirect('/dashboard/info')
                    res.end()
                }
            }).clone()

    } catch (error) {
        res.redirect('/500page')
        console.log({ error });
    }
});

// edit resume
route.post('/edit/resume', verify, upload.single('cv'), async (req, res) => {
    try {
        console.log('[body]', req.body);
        const filter = { _id: req.body.id.replace(/ /g, "") };

        let doc = await Info.findOne(filter);
        await Info.updateOne({
            _id: req.body.id.replace(/ /g, "")
        },
            {
                cv: req.file !== undefined ? req.file.filename : doc.cv,
            },
            (error, result) => {
                if (error) console.log({ error });
                else {
                    res.redirect('/dashboard/info')
                    res.end()
                }
            }).clone()

    } catch (error) {
        console.log({ error });
    }
});



// add progress
route.post('/progress', verify, async (req, res) => {
    try {
        console.log('[body]', req.body);
        const filter = { _id: req.body.id.replace(/ /g, "") };

        let doc = await Info.findOne(filter, (error) => {
            if (error) return res.redirect('/500page')
        }).clone();
        let progresses = doc.progress;
        progresses.push({
            title: req.body.progress_title,
            value: req.body.progress_value
        })
        await Info.updateOne(filter,
            {
                progress: progresses,
            },
            (error, result) => {
                if (error) console.log({ error });
                else {
                    res.redirect('/dashboard/info')
                    res.end()
                }
            }).clone()

    } catch (error) {
        console.log({ error });
    }
});


// delete progress
route.get('/progress/delete/:id', verify, async (req, res) => {
    try {
        const filter = { _id: req.params.id.replace(/ /g, "") };

        let doc = await Info.findOne(filter, (error) => {
            if (error) return res.redirect('/500page')
        }).clone();
        let progresses = doc.progress;
        progresses.splice(req.query.index, 1)
        console.log('[delete ]', progresses);
        await Info.updateOne(filter,
            {
                progress: progresses,
            },
            (error, result) => {
                if (error) console.log({ error });
                else {
                    res.redirect('/dashboard/info')
                    res.end()
                }
            }).clone()

    } catch (error) {
        console.log({ error });
    }
});





module.exports = route