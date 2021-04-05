var mongoose = require("mongoose");

var cartSchema = new mongoose.Schema({
	shoe: {
        type: String,
    },
	image: String,
	name: String,
	Price: {type: Number, required: true},
	size: {type: String, required: true},
	color: {type: String, required: true},
	quantity: {type: Number, default: 1},
	isBuy : {type: Boolean, default: false}
    
});

module.exports = mongoose.model("Cart", cartSchema);