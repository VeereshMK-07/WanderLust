const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require ("../models/listing.js");
const {isLoggedIn, isOwner , validateListing} = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer  = require("multer");
const { storage } = require("../cloudconfig.js");
const upload = multer({ storage });


//router.route method

router
.route("/")
//Index Route to get all the listings//
.get(wrapAsync(listingController.index))
//Create Route to create a new listing//
.post(isLoggedIn ,
     upload.single("listing[image]"),
     validateListing,
     wrapAsync(listingController.createListing)
);

//router for the category search
router.get("/category/:category", listingController.filterByCategory);

//search option route
router.get("/search", listingController.searchListings);



//New Route to show the form to create a new listing//
router.get("/new" , isLoggedIn , listingController.renderNewForm);


router.route("/:id")
.get(wrapAsync(listingController.showListing))     //show route
.put(isLoggedIn,
     isOwner,
     upload.single("listing[image]"),
     validateListing,
     wrapAsync(listingController.updateListing))     //Update Route//
.delete( isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));   //Delete Route//




//Edit route//
router.get("/:id/edit" , isLoggedIn , isOwner, wrapAsync(listingController.renderEditForm));





//export the router

module.exports = router;