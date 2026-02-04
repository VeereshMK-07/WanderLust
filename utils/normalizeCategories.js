require("dotenv").config();
const mongoose = require("mongoose");
const Listing = require("../models/listing");

mongoose.connect("mongodb://127.0.0.1:27017/wanderlust")
.then(() => console.log("DB Connected"));

const map = {
  "amazing pools": "pools",
  "iconic cities": "iconic",
  "castle": "castles",
  "Boats": "boats",
  "arctic ": "arctic"
};

async function run() {
  const listings = await Listing.find({});

  for (let l of listings) {
    if (map[l.category]) {
      l.category = map[l.category];
      await l.save();
      console.log("Fixed:", l.title);
    }
  }

  console.log("Done");
  mongoose.connection.close();
}

run();
