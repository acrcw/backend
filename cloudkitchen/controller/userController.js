const usermodel = require("../modals/usermodal")
module.exports.setcookies=function setcookies(req, res) {
    // res.setHeader("set-cookie", "isLoggedin=false")             
    res.cookie("isLoggedin", false, { maxAge: 1000 * 60, secure: true, httpOnly: true }) // httponly to prevent acess from frontend
    res.send("cookie has been set")
}
module.exports.getcookies=function getcookies(req, res) {
    let cookies = req.cookies;
    console.log(cookies);
    res.send("cookies received")
}

module.exports.postuser=function postuser(req, res) {
    console.log(req.body);
    users = req.body;
    res.json({
        message: "data recieved",
        user: req.body
    })
}


module.exports.getusers=async function getusers(req, res) { // fetch users from mongo db
    let allusers = await usermodel.find()
    // let allusers = await usemodel.findOne({ name: "jobanpreet Singh" })
    res.json({ message: "users:", data: allusers })
    // res.send(userdata.map((obj) => (obj.name)));
}
module.exports.updateuser=async function updateuser(req, res) {
    console.log('req body data', req.body);
    //update data in users object
    let user = await usermodel.findOneAndUpdate({ email: "jobanjp@protonmail.com" }, req.body)
    res.json({
        message: "data updated",
        updateddata: user
    })
}

module.exports.deleteuser=async function deleteuser(req, res) {
    let user = await usermodel.findOneAndDelete({ email: 'jobanjp@protonmail.com' })
    res.json({
        message: "data has been deleted",
        data: user
    })
};