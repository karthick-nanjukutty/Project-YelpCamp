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
/*Get New Form for New Request */
app.get ('/campgrounds/new' , (req,res) =>{
    res.render('campgrounds/new')
})

/*After Receiving the request from new form add to Db */

app.post ('/campgrounds' , async(req,res) =>{
    const {campground} = req.body
    const newCampground = await new YelpCamp(campground).save();
    res.redirect(`/campgrounds/${newCampground._id}`)

})
/* Show Campground Detail*/
app.get ('/campgrounds/:id' , async (req,res) =>{
    const {id} = req.params;
    const campground = await YelpCamp.findById(id)
    res.render('campgrounds/show',{campground})
})
/*Get Campgroung Details to Edit*/
app.get ('/campgrounds/:id/edit' , async(req,res) =>{
    const {id} = req.params;
    const campground = await YelpCamp.findById(id)
    res.render ('campgrounds/edit' , {campground})
})
/*Update Campground details using the id and method Override */

app.put ('/campgrounds/:id' , async(req,res) =>{
    const {id} = req.params;
    const {campground} = req.body;
    const updatedCampground = await YelpCamp.findByIdAndUpdate(id,campground)
    res.redirect(`/campgrounds/${updatedCampground._id}`)
})

/* Delete/Remove Playgound */

app.delete ('/campgrounds/:id' , async (req,res) =>{
    console.log('Deleting Campgrounds')
    const { id } = req.params;
    const deleteCampground = await YelpCamp.findByIdAndDelete(id);
    res.redirect('/campgrounds')
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
