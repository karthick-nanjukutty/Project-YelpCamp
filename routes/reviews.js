const express = require('express');
const app = express();
var router = express.Router({mergeParams: true});
const ExpressError = require('../utils/expresserror')
const wrapAsync = require('../utils/catchAsync')
const Review = require('../models/review')
const YelpCamp = require('../models/campground');
const {reviewSchema} = require('../joischema/joicampgroundschema')

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

// POST / Review ==> /camground/:id/reviews
router.post('/' , validateReview, wrapAsync(async (req,res) =>{
    const {id} = req.params
    console.log(id)
    const campground = await YelpCamp.findById(id)
    const review = new Review (req.body.review)
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    //res.send('You made it')
    req.flash('Success' , 'Created new Review')
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.delete('/:reviewId' ,wrapAsync(async (req,res) =>{
    const {id, reviewId} = req.params
    await YelpCamp.findByIdAndUpdate(id, {$pull : { reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId);
    req.flash('Success' , 'Successfully Delted Review')
    res.redirect(`/campgrounds/${id}`)

// res.send("Delete My review")
}))

module.exports = router;