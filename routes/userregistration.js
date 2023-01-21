const express = require('express');
const app = express();
var router = express.Router();
const ExpressError = require('../utils/expresserror')
const wrapAsync = require('../utils/catchAsync')
const YelpCamp = require('../models/campground');
const User = require('../models/user');
const passport = require('passport');
const userControllers = require('../controllers/users')

router.route('/register')
.get( userControllers.renderUserRegistration )
.post(wrapAsync(userControllers.createUserRegistration))

router.route('/login')
.get(userControllers.renderUserLogin)
.post(passport.authenticate('local' , { failureFlash: true, failureRedirect: '/login'}), userControllers.authenticateUserLogin)

router.get('/logout' ,userControllers.userLogout)
module.exports = router;