const YelpCamp = require('../models/campground');
const Review = require('../models/review')


module.exports.createReview = async (req,res) =>{
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
}

module.exports.deleteReview = async (req,res) =>{
    const {id, reviewId} = req.params
    console.log('Deltng Reviews')
    await YelpCamp.findByIdAndUpdate(id, {$pull : { reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId);
    req.flash('success' , 'Successfully Delted Review')
    res.redirect(`/campgrounds/${id}`)

// res.send("Delete My review")
}