const route = require('express').Router()

route.get('/', (req, res) => {
    res.render('dashboard', {
        currentPage: 'projects'
    })
    console.log('here the projects');
})

module.exports = route