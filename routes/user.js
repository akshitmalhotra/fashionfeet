var express=require("express");
var router = express.Router();
var passport= require("passport");
var User = require("../models/user");
var middleware = require("../middlewares/index");

router.get("/register",function(req,res){
	res.render("register");
})
router.post("/register",function(req,res){
	var newuser = new User({username: req.body.username,
							firstName: req.body.firstName,
						    lastName: req.body.lastName,
							email: req.body.email,
							phoneNumber: req.body.phoneno,
							address: req.body.address
						   });
	User.register(newuser,req.body.password,function(err,user){
		if(err)
		{
			req.flash("error",err.message);
			console.log(err);
			return res.redirect("back");	
		}
		passport.authenticate("local")(req,res,function(){
			req.flash("success","Hello "+user.username+", Welcome to Fashion Feet");
			res.redirect("/maleshooes");
		});
	});
});


router.post("/login",passport.authenticate("local",{
		successRedirect: "/maleshooes",
		faliureRedirect: "/",	
	}),function(req,res){
		
});

router.get("/logout",function(req,res){
	req.logout();
	req.flash("success","Logout Successfully");
	res.redirect("/maleshooes");
});

router.get("/myaccount/:id",middleware.isLoggedIn,function(req,res){
	
	res.render("myaccount",{fu: req.params.id});
});

router.put("/update-user/:id",middleware.isLoggedIn,function(req,res){
	User.findById(req.params.id,function(err,user){
		if(err){
			req.flash('error','You need to be login to do that !');
			return res.redirect("back");
		} else{
			user.username = req.body.username;
			user.firstName = req.body.firstName;
			user.lastName = req.body.lastName;
			user.email  = req.body.email;
			user.phoneNumber = req.body.phoneno;
			user.address = req.body.address;
			
			user.save();
			req.flash("success","Your Profile is Updated successfully.");
			res.redirect("/maleshooes");
		}
	})
})

const api_key = process.env.MAILGUN_KEY;
const domain = process.env.MAILGUN_DOMAIN;
var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});


router.post("/contactus",function(req,res){
	try{
		var msg = req.body.issue;
	    var data = {
		    from: req.body.email,
		    to: 'fashionfeet668@gmail.com',
		    subject: 'Some Issue! --(Contact Us Page) ',
		    html: `<p> ' ${msg} ' </p> - "From ${req.body.name}" <p> You have to responde as soon as possible! </p>`
		 };

		mailgun.messages().send(data, function (error, body) {
		if(error)
		{
			req.flash('error',"oops some happens to be wrong! "+error.message);
			return res.redirect("back");
		}	
		});	
		
		req.flash('success',"Your mail has been send.We will responde you as asoon as possible.");
		res.redirect("back");
	} catch(err){
		req.flash("error","Something happens to be wrong!!");
		console.log(err);
		res.redirect("back");
	}
})



module.exports = router;