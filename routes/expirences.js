const route = require('express').Router()

route.get('/', (req, res) => {
    res.render('dashboard', {
        currentPage: 'expirences'
    })
    console.log('here the expirences');
})

module.exports = route