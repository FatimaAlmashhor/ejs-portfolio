const route = require('express').Router()
const Skills = require('../schemas/skills')
const ejs = require('ejs');
const mongoose = require('mongoose')
const Activities = require('../schemas/activities')
const verify = require('../middlewares/verifyToken')
var allSkills = [];

route.get('/', verify, async (req, res) => {
    var skills = await Skills.find({ deleted: false }).clone().catch(function (err) { console.log(err) });
    allSkills = skills;
    let user = req.cookies.auth;
    res.render('dashboard', {
        currentPage: 'skills',
        data: skills,
        formInfo: {},
        userInfo: { name: user.fullname, role: user.auth_role }
    })
    console.log('here the skills');
});

// adding
route.post('/', verify, async (req, res) => {
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
                Activities({
                    table_name: 'skills',
                    row_id: mongoose.Types.ObjectId(result.id),
                    auth_id: mongoose.Types.ObjectId(req.cookies.auth._id),
                    actions_type: 1,
                    actions_time: new Date()
                }).save((err, result) => {
                    if (err) return res.redirect('/500page');
                })
                let user = req.cookies.auth;
                res.render('dashboard', {
                    currentPage: 'skills',
                    data: allSkills,
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
// delete
route.get('/delete/:skill_id', verify, async (req, res) => {
    try {
        await Skills.findByIdAndUpdate({
            _id: req.params.skill_id.replace(/ /g, "")
        },
            {
                deleted: true,
            }).exec()
            .then(result => {
                Activities({
                    table_name: 'skills',
                    row_id: mongoose.Types.ObjectId(result.id),
                    auth_id: mongoose.Types.ObjectId(req.cookies.auth._id),
                    actions_type: 3,
                    actions_time: new Date()
                }).save((err, result) => {
                    if (err) return res.redirect('/500page');
                })

                res.redirect('/dashboard/skills')
                res.end()

            }).catch(error => {
                console.log({ error });
            })

    } catch (error) {
        console.log({ error });
    }
});
route.get('/toggle/:skill_id/', verify, async (req, res) => {
    try {
        const filter = {
            _id: req.params.skill_id.replace(/ /g, "")
        }
        let doc = await Skills.findOne(filter, (error, result) => {
            if (error) return res.redirect('500page');
            else {
                Activities({
                    table_name: 'skills',
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

        await Skills.updateOne(filter,
            {
                is_active: newLocal
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

// get one only 
route.get('/:skill_id', verify, async (req, res) => {
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
route.get('/edit/:skill_id/', verify, async (req, res) => {
    try {

        console.log('[body]', req.query.skillName);
        await Skills.findByIdAndUpdate({
            _id: req.params.skill_id.replace(/ /g, "")
        },
            {
                skill_name: req.query.skillName,
                skill_type: req.query.skillType
            }).exec()
            .then(result => {
                Activities({
                    table_name: 'skills',
                    row_id: mongoose.Types.ObjectId(result.id),
                    auth_id: mongoose.Types.ObjectId(req.cookies.auth._id),
                    actions_type: 2,
                    actions_time: new Date()
                }).save((err, result) => {
                    if (err) return res.redirect('/500page');
                })

                res.redirect('/dashboard/skills')
                res.end()

            }).catch(error => {
                console.log({ error });
            })
    } catch (error) {
        console.log({ error });
    }
});




// not working
// route.delete('/delete/:skill_id', async (req, res) => {
//     try {
//         await Skills.deleteOne({
//             _id: req.params.skill_id.replace(/ /g, "")
//         }, (error) => {
//             if (error) console.log({ error });
//             else {
//                 var newSkills = allSkills.filter(element => element._id !== req.params.skill_id.replace(/ /g, ""))
//                 if (req.xhr) { // request was AJAX (XHR)
//                     console.log(req.xhr);
//                     res.send({
//                         currentPage: 'skills',
//                         data: newSkills,
//                     });
//                 } else { // render html template instead
//                     var html = ejs.render(
//                         'skills.ejs',
//                         { data: newSkills }
//                     );
//                     // res.json({
//                     //     currentPage: 'skills',
//                     //     data: newSkills,
//                     // })
//                     res.send({
//                         currentPage: 'skills',
//                         data: newSkills,

//                     })
//                 }


//                 res.end()
//             }
//         }).clone()

//     } catch (error) {
//         console.log({ error });
//     }
// });



module.exports = route