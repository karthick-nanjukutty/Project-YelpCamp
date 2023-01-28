
const baseJoi = require('joi')
const sanitizeHtml = require('sanitize-html');
const extension = (joi) => ({
    type: "string",
    base: joi.string(),
    messages: {
       "string.htmlStrip": "{{#label}} not contain any html tags"
    },
    rules: {
    htmlStrip: {
     validate(value, helpers) {
       const clean = sanitizeHtml(value, {
         allowedTags: [],
         allowedAttributes: {},
       });
       if (clean == value) {
         return clean;
       }
       return helpers.error("string.htmlStrip", {value})
     }
   } } } ) 
const Joi = baseJoi.extend(extension)
module.exports.campgroundSchema =  Joi.object({
    campground: Joi.object({
        title: Joi.string().required().htmlStrip(),
        price: Joi.number().required().min(0),
        location : Joi.string().required().htmlStrip(),
        image: Joi.string(),
        description: Joi.string().required().htmlStrip()

    }).required(),
    deleteImages: Joi.array()
});

module.exports.reviewSchema = Joi.object({
    review:  Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body:  Joi.string().required().htmlStrip()
    }).required()
})

