const express = require('express');
const app = express();
//const engine = require('ejs-mate');
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
const path = require('path');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
var methodOverride = require('method-override');
app.use(methodOverride('_method'));
const mongoose = require('mongoose');
const YelpCamp = require('./models/campground');
const { findById } = require('./models/campground');

app.get ('/', (req,res) =>{
    res.send('Welcome to HomePage')
})

/*Get All Campground Details */
app.get ('/campgrounds' , async (req,res) =>{
    const campgrounds = await YelpCamp.find();
    res.render('campgrounds/index', {campgrounds})
})

app.get ('/campgrounds/:id' , async (req,res) =>{
    const {id} = req.params;
    const campground = await YelpCamp.findById(id)
    res.render('campgrounds/show',{campground})
})
app.listen(3012,()=>{
    console.log("Welcome to Yelcamp on port 3012");
})



main().catch(err => console.log('OH NO ERROR', err));
async function main () {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/campyelp');
    console.log("Mongo connection Open for YelpCamp New")

    }

    catch (err) {
        console.log  ("Oh No Error!!! ", err)
    }
    
}
