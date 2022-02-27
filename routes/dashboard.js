const express = require('express')
const route = express.Router()
const app = express();
const verfiyToken = require('../middlewares/verifyToken')
app.use(express.static('/components/'))

route.get('/', verfiyToken, (req, res) => {
    res.render('dashboard', {
        userInfo: { name: 'fatima' },
        currentPage: 'welcom'
    })
})

route.get('/logout', (req, res) => {
    res.clearCookie();
    res.cookie('token', null)
    res.redirect('/auth/login')
})

route.use('/skills', require('./skills'))
route.use('/setting', require('./setting'))
route.use('/info', require('./info'))
route.use('/services', require('./services'))
route.use('/educations', require('./educations'))
route.use('/experiences', require('./experiences'))
route.use('/projects', require('./projects'))

module.exports = route