const route = require('express').Router()
const bcrypt = require('bcryptjs');
const AuthModel = require('../schemas/auth')
const jwtGenerator = require('../utils/js/jwtGenrate')
const validInfo = require("../middlewares/validation");

route.get('/login', (req, res) => {
    res.render('login')
})
route.get('/register', (req, res) => {
    res.render('register')
})
route.post('/register', validInfo, async (req, res) => {
    try {
        // 1- destracture the req.body (name ,email , password) 
        const { fname, email, password } = req.body;
        // 2- check if user exist 
        const user = await AuthModel.find({ email: email }).exec();
        // 3- bcrypt the user password 

        // if (user.rows.length > 0) {
        //     return res.status(401).json({ msg: "User already exist!" });
        // }
        // 4- enter the new user info 
        const salt = await bcrypt.genSalt(10);
        const newPassword = (password + process.env.jwtSecretAdmin)
        const bcryptPassword = await bcrypt.hash(newPassword, salt);
        console.log(bcryptPassword);

        let jwtToken;
        await new AuthModel({
            email: req.body.email,
            password: bcryptPassword,
            is_active: true
        }).save((err, result) => {
            if (err) {
                console.log(err);
            }
            else {
                console.log({ result });
                // res.render('dashboard', {
                //     currentPage: 'skills',
                //     data: allSkills,
                //     formInfo: {}
                // })
                // res.end()
                // jwtToken = jwtGenerator(result._id);
                console.log(jwtToken);
                // res.json({ jwtToken, user: result });
            }
        })



    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error')
    }
})
module.exports = route