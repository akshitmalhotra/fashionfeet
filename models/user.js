var mongoose= require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
var userSchema = new mongoose.Schema({
	username: {type: String, unique: true, required: true},
	password: String,
	firstName: String,
	lastName: String,
	phoneNumber: String,
	address: String,
	email: {type: String, unique: true, required: true},
	cart: [{
			type: mongoose.Schema.Types.ObjectId,
        	ref: "Cart"
		 }],
	totalPrice: {type: Number, default: 0},
	selsize: {type: Number, default: 7},
	selcolor: {type: String, default: "black"}
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User",userSchema); 