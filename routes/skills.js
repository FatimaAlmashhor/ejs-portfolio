const route = require('express').Router()
const skills = require('../schemas/skills')

route.get('/', (req, res) => {
    res.render('dashboard', {
        currentPage: 'skills'
    })
    console.log('here the skills');
});

route.post('/' , async (req , res )=> {
    
})

module.exports = route