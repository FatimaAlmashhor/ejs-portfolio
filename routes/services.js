const route = require('express').Router()

route.get('/', (req, res) => {
    res.render('dashboard', {
        currentPage: 'services'
    })
    console.log('here the services');
})

module.exports = route