var express = require("express");
var router = express.Router();
var User = require("../models/user");
var Shoes = require("../models/shoes");
var Cart = require("../models/cart");
var middleware = require("../middlewares/index");

router.get("/MyCart",middleware.isLoggedIn,function(req,res){
	const user = User.findById(req.user._id).populate("cart").exec(function(err,user){
		if(err){
			req.flash('error',err.message);
			return res.redirect("back");
		}
		res.render("cart",{user: user});	
	});
});

router.post("/selectedSize/:id",middleware.isLoggedIn,function(req,res){
	User.findById(req.user._id,async function(err,fuser){
		if(err){
			req.flash('error',err.message);
			return res.redirect("back");
		} else{
			fuser.selsize = await req.query.size;
			await fuser.save();
			// req.flash('success','Size Selected Successfully');
			res.redirect("/details/"+req.params.id);
		}
	});
});
router.post("/selectedColor/:id",middleware.isLoggedIn,function(req,res){
	User.findById(req.user._id,async function(err,fuser){
		if(err){
			req.flash('error',err.message);
			return res.redirect("back");
		} else{
			fuser.selcolor = await req.query.color;
			await fuser.save();
			// req.flash('success','Color Selected Successfully');
			res.redirect("/details/"+req.params.id);
		}
	});
});

router.post("/addToCart/:id",middleware.isLoggedIn,async function(req,res){
	try{
		const shoe =await Shoes.findById(req.params.id);	
		User.findById(req.user._id).populate("cart").exec(async function(err,user){
			if(err){
				console.log(err);
				req.flash('error','Something went to be wrong!!');
				return res.redirect("back");
			}
			var cprice = shoe.price;
			if(shoe.discountPrice !== 0)
			{
				cprice = shoe.discountPrice;
			}
			const newItem =await Cart.create({
				shoe: shoe._id,
				image: shoe.images[0],
				name: shoe.name,
				Price: cprice,
				size: user.selsize,
				color: user.selcolor
			});
			await user.cart.push(newItem);
			user.totalPrice = calculatePrice(user.cart);
			await user.save();
			req.flash('success','Item is added to cart successfully!');
			res.redirect("/details/"+req.params.id);
		});
	} catch(err){
		console.log(err);
		req.flash('error','Something happens to be wrong!!');
		res.redirect("back");
	}
});

router.delete("/removeItem/:item",middleware.isLoggedIn,function(req,res){
	Cart.findById(req.params.item,async function(err,delitem){
		if(err){
			req.flash('error','unable to delete '+err.message);
			return res.redirect("back");
		}
		const user = await User.findById(req.user._id).populate("cart").exec();
		await user.cart.pull(delitem._id);
		await delitem.remove();
		user.totalPrice = calculatePrice(user.cart);
		await user.save();
		req.flash('success','Removed Successfully');
		res.redirect("/MyCart");
	});
});

router.post("/incQuantity/:item",middleware.isLoggedIn,async function(req,res){
	try{
		const item =await Cart.findById(req.params.item)
		item.quantity = item.quantity + 1;
		const shoe = await Shoes.findById(req.query.shoeid);
		if(shoe.discountPrice === 0){
			item.Price = item.Price + shoe.price;
		} else{
			item.Price = item.Price + shoe.discountPrice;
		}
		await item.save();
		const user =await User.findById(req.user._id).populate("cart").exec();
		user.totalPrice = calculatePrice(user.cart);
		await user.save();
		res.redirect("/MyCart");
	} catch(err){
		req.flash('error','Something went wrong !');
		console.log(err.message);
		return res.redirect("back");
	}
	
});

router.post("/decQuantity/:item",async function(req,res){
	try{
		const item =await Cart.findById(req.params.item)
		item.quantity = item.quantity - 1;
		const shoe = await Shoes.findById(req.query.shoeid);
		if(shoe.discountPrice === 0){
			item.Price = item.Price - shoe.price;
		} else{
			item.Price = item.Price - shoe.discountPrice;
		}
		await item.save();
		const user =await User.findById(req.user._id).populate("cart").exec();
		user.totalPrice = calculatePrice(user.cart);
		await user.save();
		res.redirect("/MyCart");
	} catch(err){
		req.flash('error','Something went wrong !');
		console.log(err.message);
		return res.redirect("back");
	}
});


router.get("/checkoutform",middleware.isLoggedIn,function(req,res){
	User.findById(req.user._id).populate("cart").exec(function(err,user){
		if(err){
			req.flash('error',err.message);
			return res.redirect("back");
		}
		res.render("checkoutform",{user: user});
	});
});

router.get("/BuyNow/:id",middleware.isLoggedIn,function(req,res){
	Shoes.findById(req.params.id,function(err,shoe){
		if(err){
			req.flash('error',err.message);
			return res.redirect("back");
		}
		res.render("buynow",{item: shoe});
	});
});

// send and recieve mails
const sgMail = require("@sendgrid/mail");
const sendgridAPIKey= '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';

const api_key = "4fa261051b88373afcd9e7ee3dc9ca16-a2b91229-8cb52ad2";
const domain = "sandbox900dcc3bd52242f9a281f41039785901.mailgun.org";
var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});

sgMail.setApiKey(sendgridAPIKey);

// for ordering from cart 
router.post("/place-order",middleware.isLoggedIn,async function(req,res){
	try{
	const user = await User.findById(req.user._id).populate("cart").exec();
	var orderName='',orderQuant='';
	user.cart.forEach((item)=>{
		orderName += item.name + ' , ';
		orderQuant += item.quantity + ' , ';
	})
	var data = {
	  from: user.email,
	  to: 'fashionfeet668@gmail.com',
	  subject: 'New Order (vadhaayiaan) !!!!!',
	html: `<p>New Order! ${user.username} place a new order and You will have to deliver their order in between upcoming week at Address ${user.address}. and recive a payment of ${user.totalPrice} + 100 rupees. congrats!.</p><p> Order is: <table><tr><th>Name</th> <td> ${orderName}' </td></tr>
<tr> <th>Quantity</th> <td> ${orderQuant}' </td> </tr></table> </p>`
		
	};

	mailgun.messages().send(data, function (error, body) {
	if(error)
	{
		req.flash('error',"oops some happens to be wrong! "+error.message);
		return res.redirect("back");
	}	
	});
	sgMail.send({
            to: user.email,
            from: "fashionfeet668@gmail.com",
            subject: 'Fashion Feet App',
			html: `<p> Hello ${user.username} .</p> <p class="container">Your order of <b> '${orderName}' </b> is successfully Placed. You will recieve your order in a week at <b> Address : ${user.address}.</b> Thanks for shopping, See you again. If you are facing any issue then Please Contact us.</p>`
        });
		
	await user.cart.forEach(function(item){
		var cartid = Cart.findById(item._id,function(err,prod){
			prod.remove();
		});
	});
	user.cart = [];	
	// await user.save();
	user.totalPrice = calculatePrice(user.cart);
	await user.save();	
		
		req.flash('success',"Your Order get Placed. Check your mail for more info.");
		res.redirect("back");
		
	} catch(err){
		req.flash("error","Something happens to be wrong!!");
		console.log(err);
		res.redirect("back");
	}
});

// direct buy
router.post("/quickBuy/:id",middleware.isLoggedIn,async function(req,res){
	try{
	const user = await User.findById(req.user._id).populate("cart").exec();
	const shoe = await Shoes.findById(req.params.id);
	var orderName = shoe.name;
	var data = {
	  from: user.email,
	  to: 'fashionfeet668@gmail.com',
	  subject: 'New Order (vadhaayiaan) !!!!!',
	  html: `<p>New Order!! ${user.username} place a new order and You will have to deliver their order in between upcoming week at Address ${user.address}. and recive a payment of ${user.totalPrice} + 100 rupees. congrats!.</p><p> Order is: <table><tr><th>Name</th> <td> ${orderName}' </td></tr> </table> </p>`
		
	};

	mailgun.messages().send(data, function (error, body) {
	if(error)
	{
		req.flash('error',"oops some happens to be wrong! "+error.message);
		return res.redirect("back");
	}	
	});
	sgMail.send({
            to: user.email,
            from: "fashionfeet668@gmail.com",
            subject: 'Fashion Feet App',
			html: `<p> Hello ${user.username} .</p> <p class="container">Your order of <b> '${orderName}' </b> is successfully Placed. You will recieve your order in a week at <b> Address : ${user.address}.</b> Thanks for shopping, See you again. If you are facing any issue then Please Contact us.</p>`
        });
		
	const cart = user.cart.filter((item)=>{
		return item.shoe !== req.params.id
	})
	user.cart = await cart;	
	user.totalPrice = calculatePrice(user.cart);
	await user.save();
	
	req.flash('success',"Your Order get Placed. Check your mail for more info.");
	res.redirect("back");
		
	} catch(err){
		req.flash("error","Something happens to be wrong!!");
		console.log(err);
		res.redirect("back");
	}
});

const calculatePrice = function(cart){
	let price=0;
	cart.forEach((item)=>{
		price = price + item.Price ;
	});
	return price; 
}

module.exports = router;