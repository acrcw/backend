const path = require('path');
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken');
const { JWT_KEY } = require("../secrets.js")
const usermodel = require("../modals/usermodal.js")
const signupFilePath = path.join(__dirname, '../view/signup.html');
const loginFilePath = path.join(__dirname, '../view/login.html');
const resetpwdFilePath = path.join(__dirname, '../view/forgotpassword.html');
const updateprofilepath = path.join(__dirname, '../view/updateprofile.html');
module.exports.getforgetpwd = function getforgetpwd(req, res) {
    res.sendFile(resetpwdFilePath)
}
module.exports.forgetpassword = async function forgetpassword(req, res) {
    let { email } = req.body;
    try {
        const user = await usermodel.findOne({ email: email })
        if (user == null) {
            res.status(404).json({
                message: "user doesnt exist"
            })
        }
        else {
            const resetToken = user.createResetToken();
            let resetPasswordLink = `${req.protocol}://${req.hostname}/resetpassword/${resetToken}`
            /// send mail to user email
            //nodemailer

        }

    }
    catch (err) {
        res.status(404).json({
            message: err.message
        })
    }
}
module.exports.resetpwd = async function resetpwd(req, res) {
    try {
        const token = req.params.token;
        let { password, confirmPassword } = req.body
        const user = await usermodel.findOne({ resetToken: token });
        if (user) {
            user.resetPassword(password, confirmPassword); // will encrypt and save password 
            const updatedUser = await user.save();
            res.status(202).json({
                message: "user Password Changed"
            }).redirect("/user/login")

        }
        else
        {
            res.status(404).json({
                message: "user not found"
            })

        }
    }
    catch (err) {
        console.log(err)
    }
}
module.exports.getSignup = function getSignup(req, res) {
    // console.log(__dirname)
    res.sendFile(signupFilePath)
}

module.exports.postSignup = async function postSignup(req, res) {
    let data = req.body;
    let rv = await usermodel.create({
        name: data.name,
        email: data.email,
        password: data.password,
        confirmpassword: data.confirmpwd
    })
    res.redirect("/user/login")
}
module.exports.postLogin = async function postLogin(req, res) {
    let data = req.body;
    let user = await usermodel.findOne({ email: data.email }).exec();
    // console.log(user.password)
    if (user) {
        bcrypt.compare(data.password, user.password, function (err, result) {
            if (result) {
                console.log("compare passed");
                let uid = user['_id']; //uid for jwt
                let token = jwt.sign({ payload: uid }, JWT_KEY, { expiresIn: 60 * 60 });
                res.cookie("Loggedin", token, { httpOnly: true, maxAge: 1000 * 60, secure: true });
                res.json({
                    message: "success"
                });
            } else {
                console.log("error in password");
                res.status(401).json({
                    message: "Login failed"
                });
            }

        });
    }
    else {
        console.log("hello")
        res.json({ message: "user doesnt exist" });
    }
    console.log(user)
}
module.exports.getLogin = function getLogin(req, res) {
    res.sendFile(loginFilePath)
}
module.exports.sendupdatepage = function updateprofile(req, res) {
    res.sendFile(updateprofilepath)
}
module.exports.isAuthorized = function isAuthorized(roles) {

    return function (req, res, next) {
       
        if (roles.includes(req.role)) {
            next();
        }
        else {
            res.status(401).json({ message: "Unauthorized Route" });
        }
    }

}
//protect route 
module.exports.checkLogin = function protectroute(req, res, next) {
    if (req.cookies.Loggedin) {
        // var decoded = jwt.verify(req.cookies.Loggedin, JWT_KEY);
        jwt.verify(req.cookies.Loggedin, JWT_KEY, async function (err, decoded) {
            if (err) {
                return res.status(302).redirect("/user/login")
            }
            else {
                // console.log(decoded)
                const user = await usermodel.findById(decoded.payload)
                // console.log(user)
                req.role = user.role;
                req.id = user.id
                next();
            }

        });


    }
    else {
        return res.status(302).redirect("/user/login")
    }
}
module.exports.Logout = function Logout(req, res) {
    res.cookie("Loggedin","",{ httpOnly: true, maxAge:1, secure: true })
    res.redirect("/user/login");
}