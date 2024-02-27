const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const {isLoggedIn , isOwner , validateListing} = require("../middlewares.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const {storage} = require("../cloudconfig.js");
const upload = multer({storage });



// Listing Route and Create Route
router.route("/")
.get(wrapAsync(listingController.index))
.post(
    isLoggedIn, 
    upload.single('listing[image]'),
    wrapAsync(listingController.createListing));


// New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

// Show Route //Update Route //Delete Route
router.route("/:id").get(wrapAsync(listingController.showListing))
.put(isLoggedIn , isOwner,upload.single('listing[image]'), wrapAsync(listingController.updateListing))
.delete(isLoggedIn, isOwner,wrapAsync(listingController.destroyListing));

// Edit Route

router.get("/:id/edit", isLoggedIn, isOwner,wrapAsync(listingController.renderEditForm));

module.exports = router;