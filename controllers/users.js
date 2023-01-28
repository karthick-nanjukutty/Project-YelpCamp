const YelpCamp = require('../models/campground');
const User = require('../models/user');

module.exports.renderUserRegistration = (req,res)=>{
    res.render('users/register')
}

module.exports.createUserRegistration = async(req,res)=>{
    try {
    const {email,username,password} = req.body;
    const user =  new User({email,username});
    const registeredUser = await User.register(user,password);

    req.login(registeredUser, function(err) {
        if (err) { return next(err); }
        req.flash('success','Welcome to YelpCamp')
       res.redirect('/campgrounds')
       console.log("registered user" , registeredUser)
      });

    
    
     }
     catch (e) {
         req.flash('error' , e.message)
         res.redirect('register')

     }
    //res.send(req.body)
}

module.exports.renderUserLogin = (req,res) =>{
    res.render('users/login')
}

module.exports.authenticateUserLogin = (req,res) => {
    

    
    console.log ('Calling post login')
    req.flash('success', 'Welcome back')
    const redirectUrl = req.session.returnTo || '/campgrounds'
    delete  req.session.returnTo;
    console.log('redirecting to campgrounds after login')
    
    //res.redirect('/campgrounds')
    res.redirect(redirectUrl)
    
    
}

module.exports.userLogout = (req,res)=>{
    req.logout((err) =>{
        if(err) {
            return next(err)
        }
    });
    req.flash('success' , "Goodbye");
    res.redirect('/campgrounds')
}