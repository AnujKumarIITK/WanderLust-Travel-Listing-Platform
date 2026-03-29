// Controllers for Reviews => All Review controllers are here.

const Listing = require("../models/listing");
const Review = require("../models/review");

// Create controller to create a new review
module.exports.createReview = async(req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    req.flash("success", "Review added successfully!");

    res.redirect(`/listings/${listing._id}`);
};

// Create controller to delete a review
module.exports.destryReview = async(req, res) => {
    let { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);

    req.flash("success", "Review deleted successfully!");

    res.redirect(`/listings/${id}`);
};


