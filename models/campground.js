const mongoose = require('mongoose');
const { Schema } = mongoose;
const review = require('./review')

const yelpSchema = new Schema ({

    title: {
        type: String,
        required: true
    },

    price: {
        type: Number,
        // required: true
    },

    description: {
        type: String
    }, 

    location: {
        type: String
    }, 

    image: {
        type: String
    },

    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }]


}); 

const YelpCamp = mongoose.model('YelpCamp', yelpSchema);
module.exports = YelpCamp

