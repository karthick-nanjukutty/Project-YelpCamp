if (process.env.NODE_ENV !== 'production' ) {
    require('dotenv').config()
}
console.log(`the cloudinary name is ${process.env.CLOUDINARY_CLOUD_NAME}` )
const express = require('express');
const helmet = require("helmet");
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
const mongoSanitize = require('express-mongo-sanitize');

const MongoStore = require('connect-mongo');
const dbUrl = process.env.DB_URL || 'mongodb://127.0.0.1:27017/campyelp'
const secret = process.env.SECRET || 'thisshouldbeasecret'


app.use(express.static(path.join(__dirname, 'public')))
app.use(mongoSanitize( {replaceWith: '_'}));
const store = new MongoStore({
    mongoUrl: dbUrl,
    secret: secret,
    touchAfter: 24 * 60 * 60
})
store.on("error" , (e) =>{
    console.log ("session error" , e)
})
const sessionConfig = {
    store,
    name: 'younameit',
    secret: secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly:  true,
       // secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }

}


app.use(session(sessionConfig));

app.use(flash());
/*app.use(helmet());
// app.use(helmet({
//     contentSecurityPolicy: false
// }));
const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com",
    "https://api.tiles.mapbox.com",
    "https://api.mapbox.com",
    "https://kit.fontawesome.com",
    "https://cdnjs.cloudflare.com",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com",
    "https://stackpath.bootstrapcdn.com",
    "https://api.mapbox.com",
    "https://api.tiles.mapbox.com",
    "https://fonts.googleapis.com",
    "https://use.fontawesome.com",
];

const connectSrcUrls = [
    "https://*.tiles.mapbox.com",
    "https://api.mapbox.com",
    "https://events.mapbox.com",
    "https://res.cloudinary.com/da773w92s/"
];

const fontSrcUrls = [  ];

app.use(
    helmet({
        contentSecurityPolicy: {
            directives : {
                defaultSrc : [],
                connectSrc : [ "'self'", ...connectSrcUrls ],
                scriptSrc  : [ "'unsafe-inline'", "'self'", ...scriptSrcUrls ],
                styleSrc   : [ "'self'", "'unsafe-inline'", ...styleSrcUrls ],
                workerSrc  : [ "'self'", "blob:" ],
                objectSrc  : [],
                imgSrc     : [
                    "'self'",
                    "blob:",
                    "data:",
                    "https://res.cloudinary.com/da773w92s/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT!
                    "https://images.unsplash.com/"
                ],
                fontSrc    : [ "'self'", ...fontSrcUrls ],
               // mediaSrc   : [ "https://res.cloudinary.com/da773w92s/" ],
                //childSrc   : [ "blob:" ]
            }
        },
        crossOriginEmbedderPolicy: false
    })
);
*/
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) =>{
    console.log(req.query)
    //console.log("the session is" , req.session)
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




//mongodb://127.0.0.1:27017/campyelp




main().catch(err => console.log('OH NO ERROR', err));
async function main () {
    try {
        await mongoose.connect(dbUrl,{
            
        });
        //   mongoose.set("strictQuery" , true)
    console.log("Mongo connection Open for YelpCamp New in Atlas")

    }

    catch (err) {
        console.log  ("Oh No Error!!! ", err)
    }
    
}


app.get ('/', (req,res) =>{
    res.render('home')
    //res.send('Welcome to HomePage')
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


const port = process.env.PORT || 3016;
console.log(`the port is ${port}`)
app.listen(port,()=>{
    console.log(`Welcome to Yelcamp on port ${port}`);
})



// POST / Review ==> /camground/:id/reviews