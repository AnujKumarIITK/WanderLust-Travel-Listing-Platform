const Listing = require("./models/listing");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema } = require("./schema.js");
const { reviewSchema } = require("./schema.js");

// middleware.js to check if user is logged in before allowing them to create a new listing
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl; // Store the original URL the user was trying to access
        req.flash("error", "You must be signed in to create a New Listing!");
        return res.redirect("/login");
    }    
    next();
};

// middleware.js to check if user is logged in before allowing them to delete a review
module.exports.isLoggedInForReview = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl; // optional but useful
        req.flash("error", "You must be logged in to delete a review!");
        return res.redirect("/login");
    }
    next();
};

// middleware to make the redirect URL available in the response locals for use in views
module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl; // Make the redirect URL available in the response locals
    }
    next();
};


// middlleware to check if the user is the owner of the listing before allowing them to edit or delete it
module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing.owner._id.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the Owner of this Listing!");
        return res.redirect(`/listings/${id}`);
    }
    next();    
}

// middlleware to check if the user is the owner of the review before allowing them to edit or delete it
module.exports.isReviewAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if (!review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the Owner of this Review!");
        return res.redirect(`/listings/${id}`);
    }
    next();    
}

// Validations for Schema using Joi for Listings
module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

// Validations for Schema using Joi for Reviews
module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

