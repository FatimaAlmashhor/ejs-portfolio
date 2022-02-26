const route = require('express').Router()
const Services = require('../schemas/services')
const ejs = require('ejs')
const verify = require('../middlewares/verifyToken')
var allSkills = [];

route.get('/', verify, async (req, res) => {
    var skills = await Skills.find().clone().catch(function (err) { console.log(err) });
    allSkills = skills;
    res.render('dashboard', {
        currentPage: 'services',
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
            is_active: true,
            deleted: false
        }).save((err, result) => {
            if (err) {
                console.log(err);
            }
            else {
                allSkills.push(result)
                res.render('dashboard', {
                    currentPage: 'services',
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
                deleted: true,
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
        let newState = (req.query.state) == true ? false : true;
        console.log({ newState });
        await Skills.updateOne({
            _id: req.params.skill_id.replace(/ /g, "")
        },
            {
                is_active: newState
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
                    res.redirect('/dashboard/services')
                    res.end()
                }
            }).clone()

    } catch (error) {
        console.log({ error });
    }
});

// get one only 
route.get('/:service_id', async (req, res) => {
    try {
        await Skills.findById(req.params.service_id.replace(/ /g, ""), (err, result) => {
            if (!err) {

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
route.get('/edit/:service_id/', async (req, res) => {
    try {

        console.log('[body]', req.query.skillName);
        await Skills.updateOne({
            _id: req.params.service_id.replace(/ /g, "")
        },
            {
                skill_name: req.query.skillName,
                skill_type: req.query.skillType
            },
            (error, result) => {
                if (error) console.log({ error });
                else {
                    res.redirect('/dashboard/skills')
                    res.end()
                }
            }).clone()

    } catch (error) {
        console.log({ error });
    }
});






module.exports = route