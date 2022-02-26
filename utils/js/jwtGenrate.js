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

    //the code below was the code written from the tutorial
    //Look at file server/routes/dashboard.js to see the change code for this code

    //   function jwtGenerator(user_id) {
    //   const payload = {
    //     user: user_id
    //   };


    let key = process.env.jwtSecretAdmin

    return jwt.sign(payload, key, { expiresIn: "3d" });
}

module.exports = jwtGenerator;