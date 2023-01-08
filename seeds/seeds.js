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

const seedDb = async () =>{
    await YelpCamp.deleteMany();
    for (i=0; i<100; i++) {
        const random1000 = Math.floor(Math.random()*1000);
        const priceRandom = Math.floor (Math.random()*30);
        const sampleTitle = (array) =>{
            array[Math.floor(Math.random()*array.length)]
        }
        const yelpBulk = await new YelpCamp ({
          title: `${sampleTitle(descriptors)} ${sampleTitle(places)}`,
          location: `${cities[random1000].city},${cities[random1000].state}`,
          image: 'https://source.unsplash.com/collection/3846912',
          price: priceRandom
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
