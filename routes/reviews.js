const express = require('express');
const app = express();
var router = express.Router({mergeParams: true});
const ExpressError = require('../utils/expresserror')
const wrapAsync = require('../utils/catchAsync')
const Review = require('../models/review')
const YelpCamp = require('../models/campground');
const {validateReview} = require('../middleware')
const {isLoggedIn} = require('../middleware')
const {isReviewAuthored} = require('../middleware')
const {reviewSchema} = require('../joischema/joicampgroundschema')



// POST / Review ==> /camground/:id/reviews
router.post('/' , isLoggedIn, validateReview, wrapAsync(async (req,res) =>{
    const {id} = req.params
    console.log(id)
    const campground = await YelpCamp.findById(id)
    const review = new Review (req.body.review)
    review.author = req.user._id
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    //res.send('You made it')
    req.flash('success' , 'Created new Review')
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.delete('/:reviewId' ,isLoggedIn, isReviewAuthored,wrapAsync(async (req,res) =>{
    const {id, reviewId} = req.params
    console.log('Deltng Reviews')
    await YelpCamp.findByIdAndUpdate(id, {$pull : { reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId);
    req.flash('success' , 'Successfully Delted Review')
    res.redirect(`/campgrounds/${id}`)

// res.send("Delete My review")
}))

module.exports = router;