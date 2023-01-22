const YelpCamp = require('../models/campground');


module.exports.index = async (req,res) =>{
    const campgrounds = await YelpCamp.find();
    res.render('campgrounds/index', {campgrounds})
}

module.exports.renderNewForm = (req,res) =>{
  
    res.render('campgrounds/new')
}

module.exports.createCampgrounds = async(req,res,next) =>{
    //if (!campground) throw new ExpressError('This is a Bad Request', 400)

    const {campground} = req.body
    campground.author = req.user._id;
    campground.images = req.files.map(f =>({
        url: f.path,
        filename: f.filename
    }))
    const newCampground = await new YelpCamp(campground).save();
  
    req.flash('success' , 'Successfully made a new campground')
    res.redirect(`/campgrounds/${newCampground._id}`)

    
    
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
    const updatedCampground = await YelpCamp.findByIdAndUpdate(id,{...req.body.campground})
    const imgs = req.files.map(f =>({
        url: f.path,
        filename: f.filename
    }))
   updatedCampground.images.push (...imgs)
    await updatedCampground.save();
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