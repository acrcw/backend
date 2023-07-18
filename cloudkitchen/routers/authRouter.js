const express = require("express")
const path = require('path');
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken');
const { JWT_KEY } = require("../secrets.js")
const signupFilePath = path.join(__dirname, '../view/signup.html');
const loginFilePath = path.join(__dirname, '../view/login.html');
const usermodel = require("../modals/usermodal")
const authRouter = express.Router();
authRouter.route("/signup").get(getSignup).post(postSignup)
authRouter.route('/login').get(getLogin).post(loginuser)
function middleware(req, res, next) {
    console.log("middleware here");
    next();
}
function getSignup(req, res) {
    // console.log(__dirname)
    res.sendFile(signupFilePath)
}




async function postSignup(req, res) {
    let data = req.body;
    let rv = await usermodel.create({
        name: data.name,
        email: data.email,
        password: data.password,
        confirmpassword: data.confirmpwd
    })
    console.log(rv)
}
async function loginuser(req, res) {
    let data = req.body;
    let user = await usermodel.findOne({ email: data.email }).exec();
    if (user) {
        bcrypt.compare(data.password, user.password, function (err, result) {
            if (result) {

                let uid = user['_id']; //uid for jwt
                let token = jwt.sign({ payload: uid }, JWT_KEY, { expiresIn: 60 * 60 });
                res.cookie("Loggedin", token, { httpOnly: true, maxAge: 1000 * 60, secure: true, });
                res.json({
                    message: "sucesss"
                })
            }
            else {
                res.json({
                    message: "failed"
                })
            }
        });
    }
    else {
        console.log("hello")
        res.json({ message: "" });
    }
    console.log(user)
}
function getLogin(req, res) {
    res.sendFile(loginFilePath)
}
module.exports = authRouter;