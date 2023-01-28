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
const reviews = require('../controllers/reviews')



// POST / Review ==> /camground/:id/reviews
router.post('/' , isLoggedIn, validateReview, wrapAsync(reviews.createReview))

router.delete('/:reviewId' ,isLoggedIn, isReviewAuthored,wrapAsync(reviews.deleteReview))

module.exports = router;