//post request send data from frontend to backend
const express = require("express")
const app = express();
const cookieParser = require("cookie-parser")

app.use(express.json()); // middleware fnc used in post // to convert data into json
app.use(cookieParser()) // to use as middleware  to acess cokkies in request and response object
 
app.listen(3000)   
//mini app  
const userRouter = require("./routers/userRouter")  
app.route("/").get(redirecttologin)
 function redirecttologin(req, res) { 
    // console.log(__dirname)
    res.redirect("/user/login");
}

app.use('/user', userRouter) // base routes    