const route = require('express').Router()
const Skills = require('../schemas/skills')
const ejs = require('ejs')
var allSkills = [];

route.get('/', async (req, res) => {
    var skills = await Skills.find().clone().catch(function (err) { console.log(err) });
    allSkills = skills;
    res.render('dashboard', {
        currentPage: 'skills',
        data: skills
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
        await Skills.deleteOne({
            _id: req.params.skill_id.replace(/ /g, "")
        }, (error) => {
            if (error) console.log({ error });
            else {
                var newSkills = allSkills.filter(element => element._id !== req.params.skill_id.replace(/ /g, ""))

                var html = ejs.render(
                    'skills.ejs',
                    { data: newSkills }
                );
                console.log('the delete done');
                // res.json({
                //     currentPage: 'skills',
                //     data: newSkills,
                // })
                res.redirect('/dashboard/skills')


                res.end()
            }
        }).clone()

    } catch (error) {
        console.log({ error });
    }
});

// get one only 
route.get('/dashboard/skills/edit/:skill_id', async (req, res) => {
    try {
        var skills = await Skills.findById(req.params.skill_id.replace(/ /g, ""), (err, result) => {
            if (!err) {
                console.log({ result });
            }
        })

        // res.redirect('/dashboard/skills')
    } catch (error) {
        console.log(error);
    }
});
route.get('/edit/:skill_id', async (req, res) => {
    try {
        await Skills.updateOne({
            _id: req.params.skill_id.replace(/ /g, "")
        },
            {
                skill_name: req.body.skill_name,
                skill_type: req.body.typeOfSkill
            },
            (error, result) => {
                if (error) console.log({ error });
                else {
                    var newSkills = allSkills.filter(element => element._id !== req.params.skill_id.replace(/ /g, ""))

                    var html = ejs.render(
                        'skills.ejs',
                        { data: newSkills }
                    );
                    console.log('the delete done');
                    // res.json({
                    //     currentPage: 'skills',
                    //     data: newSkills,
                    // })
                    res.redirect('/dashboard/skills')


                    res.end()
                }
            }).clone()

    } catch (error) {
        console.log({ error });
    }
});
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
                    console.log('the delete done');
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