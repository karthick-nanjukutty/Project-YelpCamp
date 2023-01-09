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
/*
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
*/

const sampleTitle = array => array[Math.floor(Math.random()*array.length)]


const seedDb = async () =>{
    await YelpCamp.deleteMany();
    for (i=0; i<100; i++) {
        const random1000 = Math.floor(Math.random()*1000);
        const priceRandom = Math.floor (Math.random()*30);
        
        const yelpBulk = await new YelpCamp ({
          title: `${sampleTitle(descriptors)} ${sampleTitle(places)}`,
          location: `${cities[random1000].city},${cities[random1000].state}`,
          image: 'https://source.unsplash.com/collection/3846912',
          price: priceRandom,
          description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
        }).save().then (res =>{
            console.log('Many products Added' , res)
        }). catch (err =>{
            console.log("Many Products Add Failed" , err)

        })
    }
}
/* Closing Connection of Mongo*/
seedDb().then (() =>{
    mongoose.connection.close();
}).catch (e =>{
    console.log("Seeds Error" , e)
})
