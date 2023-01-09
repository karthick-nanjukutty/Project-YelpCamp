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

class AppError extends Error {
    constructor (message,status) {
        super(); 
        this.message = message;
        this.status= status
    }
}



// app.use((req,res,next)=>{
//     res.send("Your website has been hacked")
// })
app.use ((req,res,next) =>{
    const requsetIp = req.headers.host;
    req.requestTime = Date.now();
    console.log(req.requestTime);
    next()

} )
const verifyPassword = (req,res,next)=>{
    const {password} = req.query; 
    if (password=='chicken') {
        next ();
    }
    else {
        throw new AppError('Invalid Password', 405)

    }
}

app.get('/dogs', (req,res) =>{
    res.send("BOW BOW")
})

app.get('/secret', verifyPassword, (req,res) =>{
    res.send("Welcome to my Secret Page")
})

app.use((req,res) =>{
    req.status(404).message("PAGE NOT FOUND")
})

app.listen(3013,()=>{
    console.log("Welcome to Yelcamp on port 3013");
})
