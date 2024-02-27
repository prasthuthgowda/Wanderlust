const mongoose = require("mongoose");
const Review = require("./review");
const user = require("./user")
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title:{
        type: String,
        // required:true,
    },
    description :{ 
        type: String,
    },
    image:{
        url : String,
        filename : String,

    },
    price:Number,
    country: String,
    location:String,
    reviews : [
        {
            type: Schema.Types.ObjectId,
            ref:Review,
        }],
    owner : {
        type: Schema.Types.ObjectId,
        ref: user,
    },
    geometry : {
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
          },
          coordinates: {
            type: [Number],
            required: true
          }
          }
    
});

listingSchema.post("findOneAndDelete", async (listing)=>{
    if(listing){
    await Review.deleteMany({_id : {$in : listing.reviews}});
    }
})

const Listing = new mongoose.model("Listing",listingSchema);

module.exports = Listing;