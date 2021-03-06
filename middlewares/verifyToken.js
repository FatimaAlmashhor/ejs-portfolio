const jwt = require("jsonwebtoken");
require("dotenv").config();

//this middleware will on continue on if the token is inside the local storage

module.exports = async function (req, res, next) {
    // Get token from header
    // const token = req.header("token");
    const token = await req.cookies;
    const auth = await req.cookies;
    console.log(auth.auth);
    // console.log('[verify token please]', token);
    // Check if not token
    if (!token.token) {
        return await res.render('login', {
            msg: { faild: true, body: "authorization denied" }
        })
        // return res.status(403).json({ msg: "authorization denied" });
    }

    // Verify token
    try {
        //it is going to give use the user id (user:{id: user.id})
        const verify = await jwt.verify(token.token, process.env.jwtSecretAdmin);
        req.user = verify.user;
        if (auth.auth) {
            if (auth.auth.auth_role === 1) {
                if (req.path == '/login' || req.path == '/register' || req.path == '/tracker/activities' || req.path == '/tracker/members') {
                    return await res.redirect('/dashboard')
                }
            }

        }

        next();
    } catch (err) {
        return await res.render('login', {
            msg: { faild: true, body: "Token is not valid" }
        })
    }
};