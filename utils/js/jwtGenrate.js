const jwt = require("jsonwebtoken");
require("dotenv").config();

function jwtGenerator(user) {
    const payload = {
        user: {
            id: user._id,
            name: user.fullname,
            email: user.email,
            password: user.password
        }
    };
    return new Promise(function (resolve, reject) {
        var tokens = {};//generating acess token
        let key = process.env.jwtSecretAdmin
        tokens.accessToken = jwt.sign(payload, key, { expiresIn: '1h' });//generating refresh token
        tokens.refreshToken = jwt.sign(payload, key, { expiresIn: '1h' }); resolve(tokens);
    })
    //the code below was the code written from the tutorial
    //Look at file server/routes/dashboard.js to see the change code for this code

    //   function jwtGenerator(user_id) {
    //   const payload = {
    //     user: user_id
    //   };


    // key = process.env.jwtSecretAdmin

    // return jwt.sign(payload, key, { expiresIn: "3d" });
}

module.exports = jwtGenerator;