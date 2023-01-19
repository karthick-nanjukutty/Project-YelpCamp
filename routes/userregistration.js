const express = require('express');
const app = express();
var router = express.Router();
const ExpressError = require('../utils/expresserror')
const wrapAsync = require('../utils/catchAsync')
const YelpCamp = require('../models/campground');
const User = require('../models/user')

router.get('/register' , (req,res)=>{
    res.render('users/register')
})

router.post('/register' , wrapAsync(async(req,res)=>{
    try {
    const {email,username,password} = req.body;
    const user =  new User({email,username});
    const registeredUser = await User.register(user,password);
    console.log(registeredUser)
    req.flash('success','Welcome to YelpCamp')
    res.redirect('/campgrounds')
     }
     catch (e) {
         req.flash('error' , e.message)
         res.redirect('register')

     }
    //res.send(req.body)
}))
module.exports = router;