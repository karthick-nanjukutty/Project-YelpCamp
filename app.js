const express = require('express');
const app = express();
//const engine = require('ejs-mate');
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
const path = require('path');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
var methodOverride = require('method-override');
app.use(methodOverride('_method'));
const mongoose = require('mongoose');
const YelpCamp = require('./models/campground');
const { findById, collection } = require('./models/campground');
const engine = require('ejs-mate');
app.engine('ejs', engine);
const Joi = require('joi')
const ExpressError = require('./utils/expresserror')
const wrapAsync = require('./utils/catchAsync')
const Review = require('./models/review')
const campgroundsRoutes = require('./routes/campground')
const reviewRoutes = require('./routes/reviews')
const userRoutes = require('./routes/userregistration')
const {campgroundSchema,reviewSchema} = require('./joischema/joicampgroundschema')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user')


app.use(express.static(path.join(__dirname, 'public')))
const sessionConfig = {
    secret: 'thisshouldbeasecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly:  true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }

}


app.use(session(sessionConfig));

app.use(flash());



app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) =>{
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success'); 
    res.locals.error = req.flash('error')
    next ();
})





/*
app.get('/fakeUser' , async (req,res) =>{
    const user = await new User({
        email: 'kkk1@gmail.com',
        username: 'kkk1tttt',
        
    })
    const newUser = await User.register(user,'kkktttchicken')
    res.send(newUser)
}) 
*/
app.use('/', userRoutes)

app.use('/campgrounds', campgroundsRoutes)
app.use('/campgrounds/:id/reviews', reviewRoutes)








main().catch(err => console.log('OH NO ERROR', err));
async function main () {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/campyelp',{
            
        });
        //   mongoose.set("strictQuery" , true)
    console.log("Mongo connection Open for YelpCamp New")

    }

    catch (err) {
        console.log  ("Oh No Error!!! ", err)
    }
    
}


app.get ('/', (req,res) =>{
    res.send('Welcome to HomePage')
})

/*Get All Campground Details */



// app.all('*', (req,res,next) =>{
//     //res.send('404')
//     next ( new ExpressError('Page Not Found', 404))
// })

app.use ((err,req,res,next) =>{
    console.log("the error stack is " ,err.stack)
    console.log("the error message  is " ,err.message)
    console.log("the error statis is " ,err.status)
  //if (!err.message) err.message = 'Something is wrong Oh No!'
    const { status = 500 ,message = 'Something wrong'} = err;
    //res.status(status).send(message)
    res.status(status).render('error', { err })
    //res.send( 'OH Boy!! Something went wrong')
})



app.listen(3015,()=>{
    console.log("Welcome to Yelcamp on port 3015");
})



// POST / Review ==> /camground/:id/reviews