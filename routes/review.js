const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middlware.js");

const reviewController = require("../controllers/reviews.js");

// All Review routes are here.

//Reviews ==> POST Review Route
router.post("/", 
    isLoggedIn, 
    validateReview,
    wrapAsync(reviewController.createReview)
);

//Reviews ==> DELETE Review Route
router.delete("/:reviewId", 
    isLoggedIn, 
    validateReview,
    isReviewAuthor, 
    wrapAsync(reviewController.destryReview)
);

module.exports = router;

