var express = require("express");
var router = express.Router({mergeParams: true});
var Shoes = require("../models/shoes");
var Review = require("../models/reviews");
var middleware = require("../middlewares/index");

// Reviews Index
router.get("/:id/reviews", function (req, res) {
    Shoes.findById(req.params.id).populate({
        path: "reviews",
        options: {sort: {createdAt: -1}} // sorting the populated reviews array to show the latest first
    }).exec(function (err, shoe) {
        if (err || !shoe) {
            req.flash("error", err.message);
            return res.redirect("back");
        }
        res.render("review/index", {shoe: shoe});
    });
});

// Reviews New
router.get("/:id/new", middleware.isLoggedIn, middleware.checkReviewExistence, function (req, res) {
    // middleware.checkReviewExistence checks if a user already reviewed the campground, only one review per user is allowed
    Shoes.findById(req.params.id, function (err, shoe) {
        if (err) {
            req.flash("error", err.message);
            return res.redirect("back");
        }
        res.render("review/create", {shoe: shoe});

    });
});

// Reviews Create
router.post("/details/:id", middleware.isLoggedIn, middleware.checkReviewExistence, function (req, res) {
    
    Shoes.findById(req.params.id).populate("reviews").exec(function (err,shoe) {
        if (err) {
            req.flash("error", err.message);
            return res.redirect("back");
        }
        Review.create(req.body.review, function (err, review) {
            if (err) {
                req.flash("error", err.message);
                return res.redirect("back");
            }
            //add author username/id and associated campground to the review
            review.author.id = req.user._id;
            review.author.username = req.user.username;
            review.shoes = shoe;
            //save review
            review.save();
            shoe.reviews.push(review);
            // calculate the new average review for the campground
            shoe.rating = calculateAverage(shoe.reviews);
            //save campground
            shoe.save();
            req.flash("success", "Your review has been successfully added.");
            res.redirect("/details/"+shoe.id);
        });
    });
});

// Reviews Delete
router.delete("/details/:id/reviews/:review_id", middleware.checkReviewOwnership, function (req, res) {
    Review.findByIdAndRemove(req.params.review_id, function (err) {
        if (err) {
            req.flash("error", err.message);
            return res.redirect("back");
        }
        Shoes.findByIdAndUpdate(req.params.id, {$pull: {reviews: req.params.review_id}}, {new: true}).populate("reviews").exec(function (err, shoe) {
            if (err) {
                req.flash("error", err.message);
                return res.redirect("back");
            }
            // recalculate average
            shoe.rating = calculateAverage(shoe.reviews);
            //save changes
            shoe.save();
            req.flash("success", "Your review was deleted successfully.");
            res.redirect("/details/"+shoe.id);
        });
    });
});

function calculateAverage(reviews) {
    if (reviews.length === 0) {
        return 0;
    }
    var sum = 0;
    reviews.forEach(function (element) {
        sum += element.rating;
    });
    return sum / reviews.length;
}

module.exports = router;