const Listing = require("../models/listing");
const forwardGeocode = require("../utils/geocode.js");
module.exports.index = async (req , res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
}; 


module.exports.renderNewForm  =  (req ,res) =>{
    res.render("listings/new.ejs");
};

module.exports.showListing = async(req , res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({
        path :"reviews",
        populate :{
            path :"author"
        },
      })
     .populate("owner");
    //this is the error flash msg
    if(!listing){
        req.flash("error","Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs" , {listing});

};


module.exports.createListing = async(req , res , next) => {

     //  GEOCODING PART
    const geoData = await forwardGeocode(req.body.listing.location);
    console.log(geoData);

    if(!geoData){
        req.flash("error","Invalid location");
        return res.redirect("/listings/new");
    }

    let url = req.file.path;
    let filename = req.file.filename;
//    let {title , description , image , price , location , country } = req.body;  this is one way to extract data from the req.body//
//another way is to directly use req.body//
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url , filename};
     
    //  SAVE COORDINATES
    newListing.geometry = {
        type : "Point",
        coordinates : [geoData.lng, geoData.lat]
    };
    let savedListing = await newListing.save();
    console.log(savedListing);
    req.flash("success","New Listing Created!");
    res.redirect("/listings");
};


module.exports.renderEditForm = async (req , res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for does not exist!");
        return res.redirect("/listings");
    }

    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload" , "/upload/w_250");
    res.render("listings/edit.ejs" , {listing , originalImageUrl});
};


module.exports.updateListing = async(req , res) =>{
    let { id }= req.params;
    let listing = await Listing.findByIdAndUpdate(id , {...req.body.listing});

    if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url , filename};
    await listing.save();
    }
    req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`);
};


module.exports.destroyListing = async (req , res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
};


//category route
module.exports.filterByCategory = async (req, res) => {
  const { category } = req.params;
  const listings = await Listing.find({ category });
  res.render("listings/index.ejs", { allListings: listings });
};

//search route
module.exports.searchListings = async (req, res) => {
  let { q } = req.query;

  // Safety check
  if (!q || q.trim() === "") {
    return res.redirect("/listings");
  }

  const listings = await Listing.find({
    $or: [
      { title: { $regex: q, $options: "i" } },
      { location: { $regex: q, $options: "i" } },
      { country: { $regex: q, $options: "i" } }
    ]
  });

  res.render("listings/index.ejs", { allListings: listings });
};
