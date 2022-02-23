const route = require('express').Router()

route.get('/', (req, res) => {
    res.render('dashboard')
})
module.exports = route