const express = require('express');
const app = express();
var router = express.Router();
const ExpressError = require('../utils/expresserror')
const wrapAsync = require('../utils/catchAsync')
const YelpCamp = require('../models/campground');
const {isLoggedIn} = require('../middleware')
const {campgroundSchema} = require('../joischema/joicampgroundschema')

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


router.get ('/' , isLoggedIn, wrapAsync(async (req,res) =>{
    const campgrounds = await YelpCamp.find();
    res.render('campgrounds/index', {campgrounds})
}))
/*Get New Form for New Request */
router.get ('/new' , isLoggedIn, (req,res) =>{
  
    res.render('campgrounds/new')
})

/*After Receiving the request from new form add to Db */

router.post ('/' , isLoggedIn, validateCampground, wrapAsync(async(req,res,next) =>{
    //if (!campground) throw new ExpressError('This is a Bad Request', 400)

    const {campground} = req.body
    const newCampground = await new YelpCamp(campground).save();
    req.flash('success' , 'Successfully made a new campground')
    res.redirect(`/campgrounds/${newCampground._id}`)

    
    
}))
/* Show Campground Detail*/
router.get ('/:id' ,isLoggedIn, wrapAsync(async (req,res) =>{
    const {id} = req.params;
    const campground = await YelpCamp.findById(id).populate('reviews')
    console.log(campground)

    if (!campground){
        req.flash('error' , 'Cannot find that campground')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show',{campground})
}))
/*Get Campgroung Details to Edit*/
router.get ('/:id/edit' , isLoggedIn, wrapAsync(async(req,res) =>{
    const {id} = req.params;
    const campground = await YelpCamp.findById(id)
    res.render ('campgrounds/edit' , {campground})
}))
/*Update Campground details using the id and method Override */

router.put ('/:id' , validateCampground, wrapAsync(async(req,res) =>{
    const {id} = req.params;
    const {campground} = req.body;
    const updatedCampground = await YelpCamp.findByIdAndUpdate(id,campground)
    req.flash('success' ,'Successfully Updated Campground')
    res.redirect(`/campgrounds/${updatedCampground._id}`)
}))

/* Delete/Remove Playgound */

router.delete ('/:id' , wrapAsync(async (req,res) =>{
    console.log('Deleting Campgrounds')
    const { id } = req.params;
    const deleteCampground = await YelpCamp.findByIdAndDelete(id);
    req.flash('success' , 'Successfully Deleted Campground')
    res.redirect('/campgrounds')
}))

module.exports = router;