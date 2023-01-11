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
const { findById, collection } = require('./models/campground');
const engine = require('ejs-mate');
app.engine('ejs', engine);
const Joi = require('joi')
const ExpressError = require('./utils/expresserror')
const wrapAsync = require('./utils/catchAsync')
const {campgroundSchema} = require('./joischema/joicampgroundschema')

const validateCampground = (req,res,next) =>{
    
   
    
    //const joiResult = campgroundSchema.validate({campground})
    const { error }= campgroundSchema.validate(req.body);
    
    if (error) {
        console.log ("Joi result is ", error)
        const message = error.details.map( element => element.message).join(',')
        throw new ExpressError(message, 400)
    }
    else {
        next()
    }

}

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


app.get ('/', (req,res) =>{
    res.send('Welcome to HomePage')
})

/*Get All Campground Details */
app.get ('/campgrounds' , wrapAsync(async (req,res) =>{
    const campgrounds = await YelpCamp.find();
    res.render('campgrounds/index', {campgrounds})
}))
/*Get New Form for New Request */
app.get ('/campgrounds/new' , (req,res) =>{
    res.render('campgrounds/new')
})

/*After Receiving the request from new form add to Db */

app.post ('/campgrounds' , validateCampground, wrapAsync(async(req,res,next) =>{
    //if (!campground) throw new ExpressError('This is a Bad Request', 400)
    const {campground} = req.body
    const newCampground = await new YelpCamp(campground).save();
    res.redirect(`/campgrounds/${newCampground._id}`)

    
    
}))
/* Show Campground Detail*/
app.get ('/campgrounds/:id' , wrapAsync(async (req,res) =>{
    const {id} = req.params;
    const campground = await YelpCamp.findById(id)
    res.render('campgrounds/show',{campground})
}))
/*Get Campgroung Details to Edit*/
app.get ('/campgrounds/:id/edit' , wrapAsync(async(req,res) =>{
    const {id} = req.params;
    const campground = await YelpCamp.findById(id)
    res.render ('campgrounds/edit' , {campground})
}))
/*Update Campground details using the id and method Override */

app.put ('/campgrounds/:id' , validateCampground, wrapAsync(async(req,res) =>{
    const {id} = req.params;
    const {campground} = req.body;
    const updatedCampground = await YelpCamp.findByIdAndUpdate(id,campground)
    res.redirect(`/campgrounds/${updatedCampground._id}`)
}))

/* Delete/Remove Playgound */

app.delete ('/campgrounds/:id' , wrapAsync(async (req,res) =>{
    console.log('Deleting Campgrounds')
    const { id } = req.params;
    const deleteCampground = await YelpCamp.findByIdAndDelete(id);
    res.redirect('/campgrounds')
}))

app.all('*', (req,res,next) =>{
    //res.send('404')
    next ( new ExpressError('Page Not Found', 404))
})

app.use ((err,req,res,next) =>{
    console.log("the error stack is " ,err.stack)
    console.log("the error message  is " ,err.message)
    console.log("the error statis is " ,err.status)
  //if (!err.message) err.message = 'Something is wrong Oh No!'
    const { status = 500 ,message = 'Something wrong'} = err;
    //res.status(status).send(message)
    res.status(status).render('error', { err })
    //res.send( 'OH Boy!! Something went wrong')
})
app.listen(3015,()=>{
    console.log("Welcome to Yelcamp on port 3015");
})



