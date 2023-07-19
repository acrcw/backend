const mongoose = require("mongoose");
const emailval = require("email-validator");
const bcrypt = require("bcrypt")
const CryptoJS = require("crypto-js");
const { JWT_KEY } = require("../secrets.js")
mongoose.connect("mongodb+srv://joban:yzSJge5kJQHr4mw5@cloudcluster.qvkdum5.mongodb.net/?retryWrites=true&w=majority").then(function (db) {
    console.log("db connected");
    // console.log(db);
}).catch(function (err) {
    console.log(err);
})
const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: function () {
            return emailval.validate(this.email)
        }
    },
    password: {
        type: String,
        required: true,
        minLength: 8
    },
    role:{
        type:String,
        enum:['admin','user','owner','deleiveryboy'],
        default:"user"
    },
    profileimg:{
        type:String,
        default:'img/users/default.jpg'
        
    },
    resetToken:String

})
//hooks
//pre hook  // fires before save event
// userSchema.pre("save", function () {
//     console.log("before savinf in db", this)
// })
//post hook // fires after save event
// userSchema.post("save", function (doc) {
//     console.log("after saving in db", doc)
// })

//remove hook
userSchema.pre('save', function (next) { // pre hook encrypts the password
    console.log(this.password);
  
    bcrypt.hash(this.password, 10, (err, hash) => {
      if (err) {
        console.error(err);
        return next(err);
      }
  
      this.password = hash;
      console.log(this.password);
      next();
    });
  });
//reset token
userSchema.methods.createResetToken=function()
{
    //use crypto package npm
    let ciphertext = CryptoJS.AES.encrypt(this._id, JWT_KEY).toString();
    this.resetToken=ciphertext
    return this.resetToken;
}
//resetpassword handler
userSchema.methods.resetPassword=function(password,confirmPassword)
{
    this.password=password;
    this.resetToken=undefined;
}



//model

const usermodel = mongoose.model("mymodel", userSchema)
module.exports = usermodel