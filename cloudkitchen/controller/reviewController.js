const planmodel = require("../modals/mealmodal");
const reviewmodel = require("../modals/reviewmodal");
module.exports.getAllReviews = async function getAllReviews(req, res) {
    try {
        const reviews = await reviewmodel.find();
        if (reviews) {
            return res.json({
                message: "all reviews recivied",
                totalreviews: reviews.length,
                data: reviews
            })
        }
        else {
            return res.json({
                message: "reviews not found"
            })
        }
    }
    catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}
module.exports.topthreereviews = async function topthreereviews(req, res) {
    try {
        const top3review = await reviewmodel.find().sort({ rating: -1 }).limit(3)
        return res.json({ message: "top 3", data: top3review })
    }
    catch (err) {
        return res.status(500).json({ message: "review not found" })
    }
}
module.exports.getPlanReviews = async function getPlanReviews(req, res) {
    try {
        let planid = req.params.planid
        let review = await reviewmodel.find()
        let filtered=review.filter((obj)=>(obj.plan.id==planid))
        if (review) {
            return res.json({
                message: "review recived",
                totalreviews: filtered.length,
                data: filtered
            })
        }
        else {
            return res.json({
                message: "review not found"
            })
        }
    }
    catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}
module.exports.createReview = async function createReview(req, res) {
    try {
        let planId = req.params.plan
        let reviewData = req.body;
        reviewData.user = req.id;
        reviewData.plan = planId;
        let plan = await planmodel.findById(planId);
        console.log(plan)
        if (plan == null) {
            return res.status(500).json({
                message: "Plan not found"
            })
        }
        let createdReview = await reviewmodel.create(reviewData);
        plan.ratingAverage = (plan.ratingAverage + reviewData.rating) / (plan.totalReviews + 1);
        plan.totalReviews += 1;
        let updatedPlan = await plan.save();
        return res.json({
            message: "review created Sucessfully & plan updated for totalreviews",
            review: createdReview,
            plan: updatedPlan
        })
    }
    catch (err) {
        return res.status(500).json({
            message: err.message
        })
    }
}
module.exports.updateReview = async function updateReview(req, res) {
    try {
        let reviewid = req.params.reviewid
        let datatobeupdated = req.body;
        let review = await reviewmodel.findById(reviewid);
        if (review) {
            const keys = [];
            for (let key in datatobeupdated) {
                keys.push(key);
            }
            for (let i = 0; i < keys.length; i++) {
                review[keys[i]] = datatobeupdated[keys[i]]
            }
            const updatedReview = await review.save();
            return res.json({
                message: "Review updated",
                updateddata: updatedReview
            })
        }
        else {
            res.json({
                message: "review not found"
            })
        }
    }
    catch (err) {
        res.json({
            message: err
        })
    }
}
module.exports.deleteReview = async function deleteReview(req, res) {
    try {
        let id = req.params.reviewid;
        let Review = await reviewmodel.findByIdAndDelete(id);
        let plan = await planmodel.findById(Review.plan.id);
        plan.totalReviews -= 1;
        plan = await plan.save();
        return res.json({
            message: "review deleted Sucessfully and totalreviews settled",
            data: Review,
            Updateplan: plan

        })
    }
    catch (err) {
        return res.status(500).json({
            message: err.message
        })
    }
}