var Shoes = require("../models/shoes");
var Review = require("../models/reviews");
var User = require("../models/user");
var middlewareObj={};

middlewareObj.isAdmin=function(req,res,next){
	if(req.isAuthenticated())
	{
		User.findById(req.user._id,function(err,fuser){
			if(err){
				req.flash("error",err.message);
				return res.redirect("back");
			}
			if(fuser.username === "Kanav Admin" || fuser.username === "Akshit Admin")
			{
				return next();
			}
			else{
				req.flash("error","You are not allowed to do that!");
				res.redirect("back");
			}
		});
	}
	else{
		req.flash("error","You need to be Login to do that!");
		res.redirect("back");
	}
}

middlewareObj.isLoggedIn=function(req,res,next){
	if(req.isAuthenticated())
	{
		return next();
	}
	else{
		req.flash("error","You need to be Login to do that!");
		res.redirect("back");
	}
}

middlewareObj.checkReviewOwnership = function(req, res, next) {
    if(req.isAuthenticated()){
        Review.findById(req.params.review_id, function(err, foundReview){
            if(err || !foundReview){
                res.redirect("back");
            }  else {
                // does user own the comment?
                if(foundReview.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
};

middlewareObj.checkReviewExistence = function (req, res, next) {
    if (req.isAuthenticated()) {
        Shoes.findById(req.params.id).populate("reviews").exec(function (err, foundCampground) {
            if (err || !foundCampground) {
                req.flash("error", "Item not found.");
                res.redirect("back");
            } else {
                // check if req.user._id exists in foundCampground.reviews
                var foundUserReview = foundCampground.reviews.some(function (review) {
                    return review.author.id.equals(req.user._id);
                });
                if (foundUserReview) {
                    req.flash("error", "You already wrote a review.");
                    return res.redirect("/details/" + foundCampground._id);
                }
                // if the review was not found, go to the next middleware
                next();
            }
        });
    } else {
        req.flash("error", "You need to login first.");
        res.redirect("back");
    }
};


module.exports= middlewareObj;

