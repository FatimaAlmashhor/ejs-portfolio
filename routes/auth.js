const route = require('express').Router()

route.get('/login', (req, res) => {
    res.render('login')
})
module.exports = route