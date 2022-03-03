module.exports = async function (req, res, next) {
    try {
        var auth = req.cookies
        // console.log('[auth in the check activation user function]', auth.auth);
        if (auth.auth) {
            if (!(auth.auth.is_active)) {
                return res.render('login', {
                    msg: { faild: true, body: "You need to confirm your email" }
                })
            }
            else next()
        }
    } catch (error) {
        console.log(error);
    }
}