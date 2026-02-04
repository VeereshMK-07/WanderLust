require("dotenv").config();
const mongoose = require("mongoose");
const Listing = require("../models/listing");

mongoose.connect("mongodb://127.0.0.1:27017/wanderlust")
.then(()=>console.log("DB Connected"));

function decideCategory(title){
  title = title.toLowerCase();

  if(title.includes("mountain")) return "mountains";
  if(title.includes("ski")) return "mountains";
  if(title.includes("cabin")) return "camping";

  if(title.includes("beach")) return "pools";
  if(title.includes("island")) return "boats";
  if(title.includes("boat")) return "boats";

  if(title.includes("apartment")) return "rooms";
  if(title.includes("loft")) return "rooms";
  if(title.includes("room")) return "rooms";

  if(title.includes("castle")) return "castles";
  if(title.includes("farm")) return "farms";

  return "trending";
}

async function run(){
  const listings = await Listing.find({});

 for (let l of listings) {
  const cat = decideCategory(l.title);

  await Listing.updateOne(
    { _id: l._id },
    { category: cat }
  );

  console.log(l.title, "->", cat);
}


  console.log("Finished");
  mongoose.connection.close();
}

run();
