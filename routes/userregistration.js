const express = require('express');
const app = express();
var router = express.Router();
const ExpressError = require('../utils/expresserror')
const wrapAsync = require('../utils/catchAsync')
const YelpCamp = require('../models/campground');
const User = require('../models/user');
const passport = require('passport');

router.get('/register' , (req,res)=>{
    res.render('users/register')
})

router.post('/register' , wrapAsync(async(req,res)=>{
    try {
    const {email,username,password} = req.body;
    const user =  new User({email,username});
    const registeredUser = await User.register(user,password);
    console.log("registered user" , registeredUser)
    req.flash('success','Welcome to YelpCamp')
    res.redirect('/campgrounds')
     }
     catch (e) {
         req.flash('error' , e.message)
         res.redirect('register')

     }
    //res.send(req.body)
}))

router.get('/login' ,(req,res) =>{
    res.render('users/login')
})

router.post('/login', passport.authenticate('local' , { failureFlash: true, failureRedirect: '/login'}), (req,res) => {
    try {

    
    console.log ('Calling post login')
    req.flash('success', 'Welcome back')
    console.log('redirecting to campgrounds after login')
    
    res.redirect('/campgrounds')
    }
    catch (e) {
        console.log ("the error is", e)
    }
})
module.exports = router;