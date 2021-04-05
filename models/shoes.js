var mongoose= require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
var shoeSchema = new mongoose.Schema({
	name: {type: String, required: true},
	category: {type: String, required: true},
	company: { type: String, required: true},
	price: { type: Number, required: true},
	images: [{
		type: String,
		required: true
	}],
	sizes: [
		{
			type: String
		}
	],
	colors: [
		{
			type: String
		}
	],
	discount:{
		type: Number,
		default: 0,
		min: 0,
		max: 100
	},
	discountPrice: {
		type: Number,
		default: 0,
	},
	description: String,
	specifications: { 
		modelName : String,
		material: String,
		Occasion: String,
		soleMaterial: String,
		Closure: String,
		weight: Number
	},
	reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    rating: {
        type: Number,
        default: 0
    }
},
{
	timestamps: true
});

module.exports = mongoose.model("Shoes",shoeSchema); 