const express = require("express")
const userRouter = express.Router();
const {getAllusers, getusers, getcookies, postuser, setcookies, deleteuser, updateuser ,getuserProfile} = require("../controller/userController");
const {Logout,sendupdatepage,protectallusers,isAuthorized, getforgetpwd, resetpwd,forgetpassword, getSignup, postSignup, postLogin, getLogin } = require("../controller/authController")
const protectroute = require('./authhelper')
// userRouter.route('/').get(protectroute,getusers).post(postuser).patch(updateuser).delete(deleteuser)
userRouter.route("/signup").get(getSignup).post(postSignup);
userRouter.route("/login").get(getLogin).post(postLogin);
userRouter.route("/forgotpassword").get(getforgetpwd).post(forgetpassword)
userRouter.route("/resetpassword/:token").get(getforgetpwd).post(resetpwd)

userRouter.route("/allusers").get(protectallusers,isAuthorized(['user']),getAllusers)
// for user spececific pages
userRouter.route('/:id').get(sendupdatepage).patch(updateuser).delete(deleteuser) // next to base
//profile page
userRouter.route("/userProfile").get(protectallusers, getuserProfile);
userRouter.route("/logout").get(Logout);

// route for admin


module.exports = userRouter;