// Controllers for Listings => All Listing controllers are here.

const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

// index controller to get all listings
module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};

// New controller to render the form to create a new listing
module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

// Show controller to get a particular listing
module.exports.showListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate({path: "reviews", populate: { path: "author" }}).populate("owner");
    if (!listing) {
        req.flash("error", "The Listing you requested does not exist!");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
};

// Create controller to create a new listing
module.exports.createListing = async (req, res, next) => {

    // Geocoding using Mapbox
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
    })
      .send();


    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };

    newListing.geometry = response.body.features[0].geometry;
    let savedListing = await newListing.save();

    req.flash("success", "A New Listing created Successfully!");
    res.redirect("/listings");
};

// Edit controller to render the form to edit a listing
module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "The Listing you requested does not exist!");
        return res.redirect("/listings");
    }

    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
    res.render("listings/edit.ejs", { listing, originalImageUrl });
};

// Update controller to update a listing
module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing});

    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }

    req.flash("success", "Listing updated successfully!");
    res.redirect(`/listings/${id}`);
};

// Delete controller to delete a listing
module.exports.destroyListing = async (req, res) => {
    const { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted successfully!");
    res.redirect("/listings");
};

