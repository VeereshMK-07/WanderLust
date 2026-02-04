require("dotenv").config();
const mongoose = require("mongoose");
const Listing = require("../models/listing");

mongoose.connect("mongodb://127.0.0.1:27017/wanderlust")
.then(() => console.log("DB Connected"))
.catch(err => console.log(err));

async function update() {

  await Listing.updateOne(
    { title: "Mountain Retreat" },
    { category: "mountains" }
  );

  await Listing.updateOne(
    { title: "Ski Chalet in Aspen" },
    { category: "mountains" }
  );

  await Listing.updateOne(
    { title: "Beachfront Paradise" },
    { category: "pools" }
  );

  await Listing.updateOne(
    { title: "Rustic Cabin by the Lake" },
    { category: "camping" }
  );

  await Listing.updateOne(
    { title: "Private Island Retreat" },
    { category: "boats" }
  );

  console.log("Categories Updated");
  mongoose.connection.close();
}

update();
