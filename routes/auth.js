// todo 
// the redirect after register not working 

const route = require('express').Router()
const bcrypt = require('bcryptjs');
const AuthModel = require('../schemas/auth')
const jwtGenerator = require('../utils/js/jwtGenrate')
const validInfo = require("../middlewares/validation");
const verifyToken = require("../middlewares/verifyToken");

route.get('/login', verifyToken, (req, res) => {
    res.render('login', {
        msg: { faild: false, body: '' }
    })
})


route.get('/register', verifyToken, (req, res) => {
    res.render('register', {
        msg: { faild: false, body: '' }
    })
})


route.post('/login', validInfo, async (req, res) => {
    try {
        // 1- destracture the req.body (name ,email , password) 
        const { email, password } = req.body;

        let jwtToken;
        let user = await AuthModel.find({
            email: email,
        }, (err, result) => {
            if (err) {
                console.log('[err login] ',);
                return res.render('login', {
                    msg: { faild: true, body: "Invalid Credential" }
                })
            }
        }).clone().exec();
        if (user.length === 0) {
            return res.render('login', {
                msg: { faild: true, body: "Invalid Credential" }
            })
        }
        let newPassword = (password + process.env.jwtSecretAdmin)
        console.log('[the new password is] ', newPassword);
        const vildPassword = await bcrypt.compare(
            newPassword,
            user[0].password
        )

        if (!vildPassword) {
            return res.render('login', {
                msg: { faild: true, body: "Invalid Credential" }
            })
        }
        (async function () {
            jwtToken = jwtGenerator(user[0])
            console.log('[jwtToken]', jwtToken);
            res.cookie('token', jwtToken).redirect('/dashboard')
            res.end()
        })()

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error')
    }
})



route.post('/register', validInfo, async (req, res) => {
    try {
        // 1- destracture the req.body (name ,email , password) 
        const { fullname, email, password } = req.body;

        // 3- bcrypt the user password 

        // if (user.rows.length > 0) {
        //     return res.status(401).json({ msg: "User already exist!" });
        // }
        // 4- enter the new user info 

        const salt = await bcrypt.genSalt(10);
        const newPassword = (password + process.env.jwtSecretAdmin)
        const bcryptPassword = await bcrypt.hash(newPassword, salt);
        console.log({ bcryptPassword });

        let jwtToken;
        await new AuthModel({
            fullname: fullname,
            email: email,
            password: bcryptPassword,
            is_active: true,
            deleted: false
        }).save((err, result) => {
            if (err) {
                console.log('[err saving] ',);
                return res.render('register', {
                    msg: { faild: true, body: "The candidet already exist " }
                })
            }
            else {
                console.log({ result });
                jwtToken = jwtGenerator(result);
                console.log('[jwtToken]', jwtToken);
                res.cookie('token', jwtToken)
                res.redirect('/dashboard')
                // res.json({ jwtToken, user: result });
            }
        })

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error')
    }
})
route.post('/register/admin', validInfo, async (req, res) => {
    try {
        // 1- destracture the req.body (name ,email , password) 
        const { fullname, email, password } = req.body;

        // 3- bcrypt the user password 

        // if (user.rows.length > 0) {
        //     return res.status(401).json({ msg: "User already exist!" });
        // }
        // 4- enter the new user info 

        const salt = await bcrypt.genSalt(10);
        const newPassword = (password + process.env.jwtSecretAdmin)
        const bcryptPassword = await bcrypt.hash(newPassword, salt);
        console.log({ bcryptPassword });

        let jwtToken;
        await new AuthModel({
            fullname: fullname,
            email: email,
            password: bcryptPassword,
            auth_role: 0,
            is_active: true,
            deleted: false
        }).save((err, result) => {
            if (err) {
                console.log('[err saving] ',);
                return res.render('register', {
                    msg: { faild: true, body: "The candidet already exist " }
                })
            }
            else {
                console.log({ result });
                jwtToken = jwtGenerator(result);
                console.log('[jwtToken]', jwtToken);
                res.cookie('token', jwtToken)
                res.redirect('/dashboard')
                // res.json({ jwtToken, user: result });
            }
        })

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error')
    }
})
module.exports = route