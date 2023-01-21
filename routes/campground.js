const express = require('express');
const app = express();
var router = express.Router();
const ExpressError = require('../utils/expresserror')
const wrapAsync = require('../utils/catchAsync')
const YelpCamp = require('../models/campground');
const {isLoggedIn} = require('../middleware')
const {isAuthored} = require('../middleware');
const {validateCampground} = require('../middleware')
const {campgroundSchema} = require('../joischema/joicampgroundschema')
const campgrounds = require('../controllers/campgrounds')


router.route('/')
.get (wrapAsync(campgrounds.index))
/*After Receiving the request from new form add to Db */
.post ( isLoggedIn, validateCampground, wrapAsync(campgrounds.createCampgrounds))

/*Get New Form for New Request */
router.get ('/new' , isLoggedIn, campgrounds.renderNewForm)

router.route('/:id')
/* Show Campground Detail*/
.get (isLoggedIn, wrapAsync(campgrounds.showCampgroundDetails))
/*Update Campground details using the id and method Override */
.put (isLoggedIn, isAuthored, validateCampground, wrapAsync(campgrounds.editCampground))
/* Delete/Remove Playgound */
.delete (isLoggedIn, isAuthored, wrapAsync(campgrounds.removeCampground))
/*Get Campgroung Details to Edit*/

router.get ('/:id/edit' , isLoggedIn, isAuthored,wrapAsync(campgrounds.renderEditCampground))





module.exports = router;