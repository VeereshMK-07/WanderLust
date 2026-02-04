require("dotenv").config();
console.log("Script started");

const mongoose = require("mongoose");
const Listing = require("../models/listing");
const forwardGeocode = require("./geocode");

mongoose.connect("mongodb://127.0.0.1:27017/wanderlust")
  .then(() => console.log("Connected to DB"))
  .catch(err => console.log(err));

async function fixListings() {
  const listings = await Listing.find({});
  console.log("Total listings:", listings.length);

  for (let listing of listings) {

    console.log("Fixing:", listing.title);

    const geoData = await forwardGeocode(listing.location);

    if (geoData) {
      listing.geometry = {
        type: "Point",
        coordinates: [geoData.lng, geoData.lat]
      };

      await listing.save();
      console.log("Saved ✔");
    } else {
      console.log("Skipped ❌", listing.location);
    }
  }

  console.log("Finished fixing listings");
  mongoose.connection.close();
}

fixListings();
