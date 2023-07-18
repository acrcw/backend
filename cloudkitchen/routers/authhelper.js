const jwt = require('jsonwebtoken');
const {JWT_KEY} = require("../secrets")
function protectroute(req, res, next) {
    if (req.cookies.Loggedin) {
        // var decoded = jwt.verify(req.cookies.Loggedin, JWT_KEY);
        jwt.verify(req.cookies.Loggedin, JWT_KEY, function (err, decoded) {
            if (err) {
                return res.json({
                    message: "unauthorized access"
                })
            }
            else {
                console.log(decoded) // bar
                next();
            }

        });


    }
    else {
        return res.json({
            message: "unauthorized access"
        })
    }
}
module.exports = protectroute