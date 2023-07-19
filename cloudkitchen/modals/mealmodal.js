const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://joban:yzSJge5kJQHr4mw5@cloudcluster.qvkdum5.mongodb.net/?retryWrites=true&w=majority").then(function (db) {
    console.log(" meals db connected");
    // console.log(db);
}).catch(function (err) {
    console.log(err);
})
const planSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        maxLength: [20, "Plan name should not exceed more than 20 characters"]
    },
    duration: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: [true, "Price is a required field"]
    },
    ratingAverage: {
        type: Number,
    },
    discount: {
        type: Number,
        validate: [function () {
            return this.discount < 100
        }, "discount should not exceed 100"]
    },

})

const planmodel = mongoose.model("planModel", planSchema)
async function createPlan() {
    let plan = {
        name: "combo",
        duration: 30,
        price: 1000,
        ratingAverage: 5,
        discount: 20
    }
    const doc = new planmodel(plan);
    await doc.save();
}
// createPlan();
module.exports = planmodel