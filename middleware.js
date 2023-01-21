const {campgroundSchema} = require('./joischema/joicampgroundschema')
const ExpressError = require('./utils/expresserror')
const YelpCamp = require('./models/campground');
const {reviewSchema} = require('./joischema/joicampgroundschema')
const Review = require('./models/review')


module.exports.isLoggedIn = (req,res,next) =>{
    console.log("REQ USER...", req.user )
    if (!req.isAuthenticated()) {
        console.log("the path is ", req.path)
        console.log("the original url is", req.originalUrl)
        req.session.returnTo = req.originalUrl
        req.flash('error' , 'you must be signed in')
        return res.redirect('/login')
    }
    next()

}

module.exports.isAuthored  = async(req,res,next) =>{
    const {id} = req.params;
    const campgroundById = await YelpCamp.findById(id)
    console.log("requested user is " , req.user)
    if (!campgroundById.author.equals(req.user._id)){
        req.flash('error', 'You do not have permission to do that')
        res.redirect(`/campgrounds/${id}`)
    }
    next ()
}

module.exports.isReviewAuthored  = async(req,res,next) =>{
    const {id, reviewId} = req.params;
    const review = await Review.findById(reviewId)
    console.log("Review Details", review)
    console.log("requested user is " , req.user)
    if (!review.author.equals(req.user._id)){
        console.log("review author is", review.author)
        

        req.flash('error', 'You do not have permission to do Reviews')
        return res.redirect(`/campgrounds/${id}`)
    }
    next ()
}

module.exports.validateCampground = (req,res,next) =>{
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


module.exports.validateReview = (req,res,next) =>{
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
