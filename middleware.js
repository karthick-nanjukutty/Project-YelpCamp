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

