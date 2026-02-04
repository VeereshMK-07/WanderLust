const mongoose = require ("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");
const { required } = require("joi");

const listingSchema = new Schema({
    title: {
        type : String,
        required : true,
    },
    description : String,
    image : {
        url : String,
        filename : String,  
    },
    price : Number,
    location : String,
    country : String,
    reviews : [
        {
            type : Schema.Types.ObjectId,
            ref : "Review",
        }
    ],

    owner : {
        type : Schema.Types.ObjectId,
        ref : "User",
    },

    geometry : {
        type : {
        type : String,
        enum : ["Point"],
        required : true,
    },

    coordinates : {
        type : [Number],
        required : true,
    },
},
    category: {
  type: String,
  enum: [
    "mountains",
    "arctic",
    "farms",
    "rooms",
    "pools",
    "trending",
    "camping",
    "iconic",
    "castles",
    "domes",
    "boats"
  ],
},

});

//this is for deleting the all the reviews  which is store in the database this will delete the reviews by id 
listingSchema.post("findOneAndDelete",async(listing) => {
    if(listing ){
        await Review.deleteMany({_id: {$in: listing.reviews}});
    }
});

//to create a model//
const Listing = mongoose.model("Listing" , listingSchema);
module.exports = Listing ;