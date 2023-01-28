const mongoose = require('mongoose');
const { Schema } = mongoose;
const review = require('./review')



const imageSchema = new Schema({
    url: String,
        filename: String

})
//https://res.cloudinary.com/da773w92s/image/upload/w_300/v1674397190/Yelpcamp/hvmuhcwqhywthmnvdktd.png
//https://res.cloudinary.com/da773w92s/image/upload/v1674397190/Yelpcamp/hvmuhcwqhywthmnvdktd.png

imageSchema.virtual('thumbnail').get(function() {
   return  this.url.replace('/upload', '/upload/w_200');
})

const opts = { toJSON: { virtuals: true } };

const yelpSchema = new Schema ({

    title: {
        type: String,
        required: true
    },

    images: [imageSchema],
    geometry:  {
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
      },

    // images: [{
    //     url: String,
    //     filename: String
    // }],

    price: {
        type: Number,
        // required: true
    },

    description: {
        type: String
    }, 

    location: {
        type: String,
    }, 



    

    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },



    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }], 
    


}, opts); 

yelpSchema.virtual('properties.popUpMarkup').get(function() {
    return   `<strong><a href="/campgrounds/${this._id}">${this.title} </a></strong>
    <p>${this.description.substring(0,20)}... </p>`;
    
 })
yelpSchema.post('findOneAndDelete' , async ( doc) =>{
    if (doc){
        console.log( "DELTED", doc ," is DELETED")
        await review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
   
})

const YelpCamp = mongoose.model('YelpCamp', yelpSchema);
module.exports = YelpCamp

