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

const yelpSchema = new Schema ({

    title: {
        type: String,
        required: true
    },

    images: [imageSchema],

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
    }]


}); 
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

