const Listing = require("../models/listing.js");
const mbxgeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxgeocoding({ accessToken: mapToken });

module.exports.index = async(req,res)=>{
    const allListings = await Listing.find({});
    res.render("listing/index.ejs", {allListings});
};

module.exports.renderNewForm = (req,res)=>{
    res.render("listing/new.ejs");
};

module.exports.showListing = async(req,res)=>{
    const {id} = req.params;
    const listing = await Listing.findById(id)
    .populate({
        path:"reviews",
        populate:{
            path:"author",
        },
    })
    .populate("owner");
    if(!listing){
        req.flash("error", "Listing you requested for does not exists!")
        res.redirect("/listing");
    }
    console.log(listing);
    res.render("listing/show.ejs", {listing});
}

module.exports.createListing = async (req,res,next)=>{
   let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
      })
        .send();

    const newListing = new Listing(req.body.listing);
    let url = req.file.path;
    let filename = req.file.filename;

    newListing.owner = req.user._id;
    newListing.image = {url , filename};
    newListing.geometry = response.body.features[0].geometry;
    let savedListing = await newListing.save();
    console.log(savedListing);
    
    req.flash("success","New Listing is created");
    res.redirect("/listing");
};

module.exports.renderEditForm = async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing you requested for does not exists!")
        res.redirect("/listing");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload" , "/upload/w_250");
    res.render("listing/edit.ejs",{listing,originalImageUrl});
};

module.exports.updateListing = async(req,res)=>{
    let  { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id,{ ...req.body.listing});

    if(typeof req.file !="undefined"){

    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url , filename };
    await listing.save();
    }
    req.flash("success","Lisiting Updated");
    res.redirect(`/listing/${id}`);
};

module.exports.destroyListing = async(req,res)=>{
    let { id } = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    req.flash("success","Lisiting Deleted Successful");

    res.redirect("/listing");
}