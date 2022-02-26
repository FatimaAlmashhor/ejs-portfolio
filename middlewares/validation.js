module.exports = async function (req, res, next) {
    const { email, password, comfirmPassword, fullname } = req.body;

    function validEmail(userEmail) {
        return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(userEmail);
    }
    function validPassword(userPassword) {
        let reg = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{6,})");
        if (userPassword.match(reg) !== null) {
            return true
        }
        else return false
    }

    if (req.path === "/register") {
        if (![email, password, comfirmPassword, fullname].every(Boolean)) {
            console.log('register', [email, password, comfirmPassword, fullname].every(Boolean));
            // res.json("Missing Credentials");
            return await res.render('register', {
                msg: { faild: true, body: "Missing Credentials" }
            })
        } else if (!validEmail(email)) {
            // res.json("Invalid Email");
            return await res.render('register', {
                msg: { faild: true, body: "Invalid Email" }
            })
        } else if (!(validPassword(password))) {
            // res.json("Your password  need at least have uppercase , lowercase , number , symble with at least 6 chars");
            return await res.render('register', {
                msg: { faild: true, body: "Your password  need at least have uppercase , lowercase , number , symble with at least 6 chars" }
            })
        } else if (password !== comfirmPassword) {
            // res.json('Your password do not match')
            return await res.render('register', {
                msg: { faild: true, body: "Your password do not match" }
            })
        }
    } else if (req.path === "/login") {
        if (![email, password].every(Boolean)) {
            return res.json("Missing Credentials");
        } else if (!validEmail(email)) {
            return res.json("Invalid Email");
        }
    }

    next();
};

// password test Aa*sd3g