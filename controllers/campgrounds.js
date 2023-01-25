const YelpCamp = require('../models/campground');
const {cloudinary} = require('../cloudinary')
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding")

// const mbxStyles = require('@mapbox/mapbox-sdk/services/styles');
const mbxGeocodingService = mbxGeocoding({ accessToken: process.env.MAPBOX_TOKEN });

module.exports.index = async (req,res) =>{
    const campgrounds = await YelpCamp.find();
    res.render('campgrounds/index', {campgrounds})
}

module.exports.renderNewForm = (req,res) =>{
  
    res.render('campgrounds/new')
}

module.exports.createCampgrounds = async(req,res,next) =>{
    //if (!campground) throw new ExpressError('This is a Bad Request', 400)
   const geoData = await  mbxGeocodingService.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    console.log(geoData.body.features[0].geometry)
    res.send(geoData.body.features[0].geometry)

    // const {campground} = req.body
    // campground.author = req.user._id;
    // campground.images = req.files.map(f =>({
    //     url: f.path,
    //     filename: f.filename
    // }))
    // const newCampground = await new YelpCamp(campground).save();
  
    // req.flash('success' , 'Successfully made a new campground')
    // res.redirect(`/campgrounds/${newCampground._id}`)

    
    
}

module.exports.showCampgroundDetails =async (req,res) =>{
    const {id} = req.params;
    const campground = await YelpCamp.findById(id)
    .populate({path:'reviews', populate: {path: 'author'}}).populate('author')
    
    console.log(campground)

    if (!campground){
        req.flash('error' , 'Cannot find that campground')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show',{campground})
}

module.exports.renderEditCampground = async(req,res) =>{
    const {id} = req.params;
    const campgroundById = await YelpCamp.findById(id)

    if (!campgroundById) {
        req.flash('error', 'Cannot find that campground')
        return res.redirect('/campgrounds')
    }

   
    res.render ('campgrounds/edit' , {campground : campgroundById})
}

module.exports.editCampground = async(req,res) =>{

    const {id} = req.params;
    //const {campground} = req.body;
    console.log("to be updated campground", req.body)
    const updatedCampground = await YelpCamp.findByIdAndUpdate(id,{...req.body.campground})
    const imgs = req.files.map(f =>({
        url: f.path,
        filename: f.filename
    }))
   updatedCampground.images.push (...imgs)


    await updatedCampground.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename)
        }
    await updatedCampground.updateOne({$pull : {images: {filename: {$in: req.body.deleteImages}}}})
    }
    console.log("after update details" , updatedCampground)
   req.flash('success' ,'Successfully Updated Campground')
    res.redirect(`/campgrounds/${updatedCampground._id}`)
}

module.exports.removeCampground = async (req,res) =>{
    console.log('Deleting Campgrounds')
    const { id } = req.params;
    const deleteCampground = await YelpCamp.findByIdAndDelete(id);
    req.flash('success' , 'Successfully Deleted Campground')
    res.redirect('/campgrounds')
}

//https://res.cloudinary.com/da773w92s/image/upload/w_300/v1674397190/Yelpcamp/hvmuhcwqhywthmnvdktd.png