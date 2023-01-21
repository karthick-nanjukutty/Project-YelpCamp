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






router.get ('/' , wrapAsync(campgrounds.index))
/*Get New Form for New Request */
router.get ('/new' , isLoggedIn, campgrounds.renderNewForm)

/*After Receiving the request from new form add to Db */

router.post ('/' , isLoggedIn, validateCampground, wrapAsync(campgrounds.createCampgrounds))
/* Show Campground Detail*/
router.get ('/:id' ,isLoggedIn, wrapAsync(campgrounds.showCampgroundDetails))
/*Get Campgroung Details to Edit*/
router.get ('/:id/edit' , isLoggedIn, isAuthored,wrapAsync(campgrounds.renderEditCampground))
/*Update Campground details using the id and method Override */

router.put ('/:id' ,isLoggedIn, isAuthored, validateCampground, wrapAsync(campgrounds.editCampground))

/* Delete/Remove Playgound */

router.delete ('/:id' , isLoggedIn, isAuthored, wrapAsync(campgrounds.removeCampground))

module.exports = router;