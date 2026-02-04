const mongoose = require("mongoose");
const initData = require("./data");
const Listing = require("../models/listing.js");

//to store the url of the database//
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";  //wanderlust is the database name//

//to call  the main function//
main() .then(() => {
    console.log("connected to DB");
}).catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGO_URL)
}

const initDB = async () => {
    await Listing.deleteMany({});   //to clear the existing data in the database//
    initData.data = initData.data.map((obj) => ({...obj , owner : "697b2c3c1dd480d52b295d08"}));
    await Listing.insertMany(initData.data);    //this is to insert the sample data to the database//
    console.log("Data was initialized");
};
initDB();