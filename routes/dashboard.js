const express = require('express')
const route = express.Router()
const app = express();
const verfiyToken = require('../middlewares/verifyToken')
app.use(express.static('/components/'))

route.get('/', verfiyToken, (req, res) => {
    res.render('dashboard', {
        currentPage: 'infors'
    })
})

route.use('/skills', require('./skills'))
route.use('/services', require('./services'))
route.use('/educations', require('./educations'))
route.use('/expirences', require('./expirences'))
route.use('/projects', require('./projects'))

module.exports = route