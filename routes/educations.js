const route = require('express').Router()

route.get('/', (req, res) => {
    res.render('dashboard', {
        currentPage: 'educations'
    })
    console.log('here the educations');
})

module.exports = route