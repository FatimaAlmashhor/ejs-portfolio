const express = require('express')
const route = express.Router()
const app = express();
const verfiyToken = require('../middlewares/verifyToken')
const checkActivationUser = require('../middlewares/checkActivationUser')
app.use(express.static('/components/'))


route.get('/', checkActivationUser, verfiyToken, (req, res) => {
    let user = req.cookies.auth;
    res.render('dashboard', {
        userInfo: { name: user.fullname, role: user.auth_role },
        currentPage: 'welcom'
    })
})


route.get('/logout', (req, res) => {
    res.clearCookie();
    res.cookie('token', null)
    res.cookie('auth', null)
    res.redirect('/auth/login')
})

route.use('/skills', require('./skills'))
route.use('/setting', require('./setting'))
route.use('/tracker', require('./tracker'))
route.use('/info', require('./info'))
route.use('/services', require('./services'))
route.use('/educations', require('./educations'))
route.use('/experiences', require('./experiences'))
route.use('/projects', require('./projects'))

module.exports = route