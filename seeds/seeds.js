const mongoose = require('mongoose');
const YelpCamp = require('../models/campground');
const cities = require('./cities');
const {places,descriptors } = require('./seedHelpers');

main().catch(err => console.log('OH NO ERROR', err));
async function main () {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/campyelp');
    console.log("Mongo connection Open for YelpCamp")

    }

    catch (err) {
        console.log  ("Oh No Error!!! ", err)
    }
    
}

/* Inserting Single data */

const p = new YelpCamp({
    title: 'Canada Canopy',
    price: 80,
    description: " This is the awesome place to see Canopy",
    location: 'Windsor',
}).save().then(res =>{
    console.log(res, 'First Product Added')
}).catch (err =>{
    console.log('First Product Add Failed' , err)
})

