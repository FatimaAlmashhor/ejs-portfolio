const route = require('express').Router()
const Skills = require('../schemas/skills')

route.get('/', (req, res) => {
    res.render('dashboard', {
        currentPage: 'skills'
    })
    console.log('here the skills');
});

route.post('/', async (req, res) => {
    try {
        console.log(req.body);
        const skillsInstanse = new Skills({
            skill_name: req.body.skill,
            skill_type: req.body.typeOfskill,
            is_active: true
        })

        skillsInstanse.save((err, result) => {
            if (err) {
                console.log(err);
            }
            else {
                console.log(result);
            }
        })
        res.end()
    } catch (error) {
        console.log({ error });
    }
})

module.exports = route