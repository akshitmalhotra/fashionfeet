require("dotenv").config();
var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
	flash       = require("connect-flash"),
    passport    = require("passport"),
    localStrategy = require("passport-local"),
    methodOverride = require("method-override"),
	$ = require("jquery");

var User = require("./models/user");

var userRoutes = require("./routes/user"),
	brandShoes = require('./routes/malebrands/brandShoes'),
	reviews    = require("./routes/reviews"),
	mycart      = require('./routes/cart');
	


mongoose.connect(process.env.MONGODB_URL,{
	useNewUrlParser:true,
	useUnifiedTopology:true,
	useCreateIndex: true
}).then(()=> {
	console.log("Connected to DB");
}).catch(err => {
	console.log("Error",err.message);
});


mongoose.set('useCreateIndex', true);
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname+'/public'));
app.use(methodOverride("_method"));
app.use(flash());

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "fashion feet!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(async function(req, res, next){
	res.locals.currUser = req.user;
	try{
		if(req.user){
			const user = await User.findById(req.user._id).populate("cart").exec();
			res.locals.usercart = user.cart;	
		}
	} catch(err){
		console.log(err.message);
	}
   	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
   	next();
});

app.get("/",function(req,res){
	res.render("landing");	
});
app.get("/contact-us",function(req,res){
	res.render("contactus");	
});
app.get("/about-us",function(req,res){
	res.render("aboutus");	
});


app.use(brandShoes);
app.use(userRoutes);
app.use(reviews);
app.use(mycart);

app.get("*",function(req,res){
	res.render("404");
})

app.listen(process.env.PORT || 3000, process.env.IP, function(){
   console.log("Server started");
});
