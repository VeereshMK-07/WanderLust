require("dotenv").config();
const mongoose = require("mongoose");
const Listing = require("../models/listing");

mongoose.connect("mongodb://127.0.0.1:27017/wanderlust")
  .then(() => console.log("DB Connected"))
  .catch(err => console.log(err));

const guessCategory = (title) => {
  title = title.toLowerCase();

  if (title.includes("mount") || title.includes("hill")) return "mountains";
  if (title.includes("beach") || title.includes("coast")) return "trending";
  if (title.includes("farm")) return "farms";
  if (title.includes("camp")) return "camping";
  if (title.includes("room")) return "rooms";
  if (title.includes("castle")) return "castles";
  if (title.includes("pool")) return "pools";
  if (title.includes("boat")) return "boats";
  if (title.includes("arctic") || title.includes("snow")) return "arctic";
  if (title.includes("city")) return "iconic";
  if (title.includes("dome")) return "domes";

  return "trending"; // default
};

async function fix() {
  const listings = await Listing.find({ category: { $exists: false } });

  console.log("Listings needing category:", listings.length);

  for (let listing of listings) {
    listing.category = guessCategory(listing.title);
    await listing.save();
    console.log("Updated:", listing.title);
  }

  console.log("Finished");
  mongoose.connection.close();
}

fix();
