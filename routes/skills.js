const route = require('express').Router()

route.get('/', (req, res) => {
    res.render('dashboard', {
        currentPage: 'skills'
    })
    console.log('here the skills');
})

module.exports = route