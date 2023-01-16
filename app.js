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
const Review = require('./models/review')
const campgroundsRoutes = require('./routes/campground')
const {campgroundSchema,reviewSchema} = require('./joischema/joicampgroundschema')

app.use('/campgrounds', campgroundsRoutes)



const validateReview = (req,res,next) =>{
    const {error} = reviewSchema.validate(req.body);
    if (error) {
        console.log ("Joi result is for REview Schema ", error)
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

// POST / Review ==> /camground/:id/reviews
app.post('/camgrounds/:id/reviews' , validateReview, wrapAsync(async (req,res) =>{
    const {id} = req.params
    const campground = await YelpCamp.findById(id)
    const review = new Review (req.body.review)
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    //res.send('You made it')
    res.redirect(`/campgrounds/${campground._id}`)
}))

app.delete('/campgrounds/:id/reviews/:reviewId' ,wrapAsync(async (req,res) =>{
    const {id, reviewId} = req.params
    await YelpCamp.findByIdAndUpdate(id, {$pull : { reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`)

// res.send("Delete My review")
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



// POST / Review ==> /camground/:id/reviews