const route = require('express').Router()
const Skills = require('../schemas/skills')
const ejs = require('ejs')
var allSkills = [];

route.get('/', async (req, res) => {
    var skills = await Skills.find().clone().catch(function (err) { console.log(err) });
    allSkills = skills;
    res.render('dashboard', {
        currentPage: 'skills',
        data: skills,
        formInfo: {}
    })
    console.log('here the skills');
});

route.post('/', async (req, res) => {
    try {
        console.log(req.body);
        await new Skills({
            skill_name: req.body.skill,
            skill_type: req.body.typeOfSkill,
            is_active: true
        }).save((err, result) => {
            if (err) {
                console.log(err);
            }
            else {
                allSkills.push(result)
                res.render('dashboard', {
                    currentPage: 'skills',
                    data: allSkills,
                    formInfo: {}
                })
                res.end()
            }
        })

    } catch (error) {
        console.log({ error });
    }
});
route.get('/delete/:skill_id', async (req, res) => {
    try {
        await Skills.updateOne({
            _id: req.params.skill_id.replace(/ /g, "")
        },
            {
                is_active: false,
            },
            (error, result) => {
                if (error) console.log({ error });
                else {
                    console.log({ result });
                    var newSkills = allSkills.map(element => {
                        if (element._id == req.params.skill_id.replace(/ /g, "")) {
                            element.is_active = false;

                            return element
                        }
                        else return element
                    })

                    // res.render('dashboard', {
                    //     currentPage: 'skills',
                    //     data: newSkills,
                    //     formInfo: {}
                    // })
                    res.redirect('/dashboard/skills')
                    res.end()
                }
            }).clone()
        // await Skills.deleteOne({
        //     _id: req.params.skill_id.replace(/ /g, "")
        // }, (error) => {
        //     if (error) console.log({ error });
        //     else {
        //         res.redirect('/dashboard/skills')
        //         res.end()
        //     }
        // }).clone()

    } catch (error) {
        console.log({ error });
    }
});
route.get('/toggle/:skill_id/', async (req, res) => {
    try {
        console.log(req.body.is_active);
        console.log(req.query.state);
        await Skills.updateOne({
            _id: req.params.skill_id.replace(/ /g, "")
        },
            {
                is_active: req.query.state ? false : true,
            },
            (error, result) => {
                if (error) console.log({ error });
                else {
                    console.log({ result });
                    var newSkills = allSkills.map(element => {
                        if (element._id == req.params.skill_id.replace(/ /g, "")) {
                            element.is_active = false;

                            return element
                        }
                        else return element
                    })

                    // res.render('dashboard', {
                    //     currentPage: 'skills',
                    //     data: newSkills,
                    //     formInfo: {}
                    // })
                    res.redirect('/dashboard/skills')
                    res.end()
                }
            }).clone()
        // await Skills.deleteOne({
        //     _id: req.params.skill_id.replace(/ /g, "")
        // }, (error) => {
        //     if (error) console.log({ error });
        //     else {
        //         res.redirect('/dashboard/skills')
        //         res.end()
        //     }
        // }).clone()

    } catch (error) {
        console.log({ error });
    }
});

// get one only 
route.get('/:skill_id', async (req, res) => {
    try {
        await Skills.findById(req.params.skill_id.replace(/ /g, ""), (err, result) => {
            if (!err) {
                // res.render('dashboard', {
                //     currentPage: 'skills',
                //     data: allSkills,
                //     formInfo: {
                //         skill_name: result.skill_name,
                //         skill_type: result.skill_type,

                //     }
                // })
                res.json({
                    formInfo: {
                        skill_name: result.skill_name,
                        skill_type: result.skill_type,
                    }
                })
            }
        }).clone()

        // res.redirect('/dashboard/skills')
    } catch (error) {
        console.log(error);
    }
});
route.post('/edit/:skill_id', async (req, res) => {
    try {
        console.log('[body]', req.body.skill_name);
        await Skills.updateOne({
            _id: req.params.skill_id.replace(/ /g, "")
        },
            {
                skill_name: req.body.skill_name,
                skill_type: req.body.skill_type
            },
            (error, result) => {
                if (error) console.log({ error });
                else {
                    var newSkills = allSkills.map(element => {
                        if (element._id == req.params.skill_id.replace(/ /g, "")) {
                            element.skill_name = req.body.skill_name;
                            element.skill_type = req.body.skill_type;

                            return element
                        }
                        else return element
                    })

                    // res.render('dashboard', {
                    //     currentPage: 'skills',
                    //     data: newSkills,
                    //     formInfo: {}
                    // })
                    res.redirect('/dashboard')
                    res.end()
                }
            }).clone()

    } catch (error) {
        console.log({ error });
    }
});




// not working
route.delete('/delete/:skill_id', async (req, res) => {
    try {
        await Skills.deleteOne({
            _id: req.params.skill_id.replace(/ /g, "")
        }, (error) => {
            if (error) console.log({ error });
            else {
                var newSkills = allSkills.filter(element => element._id !== req.params.skill_id.replace(/ /g, ""))
                if (req.xhr) { // request was AJAX (XHR)
                    console.log(req.xhr);
                    res.send({
                        currentPage: 'skills',
                        data: newSkills,
                    });
                } else { // render html template instead
                    var html = ejs.render(
                        'skills.ejs',
                        { data: newSkills }
                    );
                    // res.json({
                    //     currentPage: 'skills',
                    //     data: newSkills,
                    // })
                    res.send({
                        currentPage: 'skills',
                        data: newSkills,

                    })
                }


                res.end()
            }
        }).clone()

    } catch (error) {
        console.log({ error });
    }
});



module.exports = route