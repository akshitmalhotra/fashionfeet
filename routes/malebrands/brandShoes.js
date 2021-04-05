var express = require("express");
var router = express.Router();
var Shoes = require("../../models/shoes"); 
var middleware = require("../../middlewares/index");

router.get("/maleshooes",function(req,res){
	res.render("home/homeMale");
});

router.get("/createShoe",middleware.isAdmin,function(req,res){
	res.render("brands/create");
});
router.post("/addShoes",middleware.isAdmin,async function(req,res){
	try{
	const image = [];
	image.push(req.body.imagetop);
	image.push(req.body.imageleft);
	image.push(req.body.imageright);
	image.push(req.body.imagebottom);	
	const sizes = req.body.size.split(' ');
	const colors = req.body.color.split(' ');
	const spec = {
		modelName : req.body.model,
		material: req.body.material,
		Occasion: req.body.occasion,
		soleMaterial: req.body.sole,
		Closure: req.body.closure,
		weight: req.body.weight
	}
	const dis = Number(req.body.discount);
	const pric = Number(req.body.price);
	var dp=0;
	if(dis >= 1){
		dp=calculateDiscount(dis,pric);
	}
	const newShoe = {
			name: req.body.name,
			category: req.body.category,
			company: req.body.company,
			price: req.body.price,
			discount: req.body.discount,
			discountPrice: dp,
			images: image,
			sizes: sizes, 
			colors: colors,
			description: req.body.description,
			specifications: spec
	}
	const shoe = await Shoes.create(newShoe);
	
	res.redirect("/maleshooes");
	} catch(e){
		req.flash('error',e.message);
		console.log("error"+e);
		res.redirect("back");
	}
});

router.get("/nikeshooes",function(req,res){
	if(req.query.high)
	{
		Shoes.find({company: "nike",
				price: {$gt: req.query.low,$lt: req.query.high},
		    },function(err,shoes){
		if(err){
			console.log(err);
			return res.redirect("back");
		}
			res.render("brands/nike",{shoes: shoes})
	});
	} else if(req.query.sortby){
		const opt = req.query.sortby.split(":");
		const Sort={};
		Sort[opt[0]] = opt[1] === 'dec' ? -1 : 1;
		Shoes.find({company: "nike"}).sort(Sort).exec(function(err,shoes){
		if(err){
			console.log(err);
			return res.redirect("back");
		}
			res.render("brands/nike",{shoes: shoes});
		});
	} else{
		Shoes.find({company: "nike"},function(err,ps){
			if(err){
				req.flash("error",err.message);
				res.redirect("back");
			} else{
				res.render("brands/nike",{shoes: ps});
			}
		});
	}
});

router.get("/adidasshooes",function(req,res){
	
	if(req.query.high)
	{
		Shoes.find({company: "adidas",
				price: {$gt: req.query.low,$lt: req.query.high},
		    },function(err,shoes){
		if(err){
			console.log(err);
			return res.redirect("back");
		}
		res.render("brands/adidas",{shoes: shoes})
	});
	} else if(req.query.sortby){
		const opt = req.query.sortby.split(":");
		const Sort={};
		Sort[opt[0]] = opt[1] === 'dec' ? -1 : 1;
		Shoes.find({company: "adidas"}).sort(Sort).exec(function(err,shoes){
		if(err){
			console.log(err);
			return res.redirect("back");
		}
			res.render("brands/adidas",{shoes: shoes});
		});
	} else{
		Shoes.find({company: "adidas"},function(err,ps){
		if(err){
			req.flash("error",err.message);
			res.redirect("back");
		} else{
			res.render("brands/adidas",{shoes: ps});
		}
	});	
	}
	
});

router.get("/jordanshooes",function(req,res){
	
	if(req.query.high){
		Shoes.find({company: "jordan",
				price: {$gt: req.query.low,$lt: req.query.high},
		    },function(err,shoes){
		if(err){
			console.log(err);
			return res.redirect("back");
		}
		res.render("brands/jordan",{shoes: shoes})
	});   
	}else if(req.query.sortby){
		const opt = req.query.sortby.split(":");
		const Sort={};
		Sort[opt[0]] = opt[1] === 'dec' ? -1 : 1;
		Shoes.find({company: "jordan"}).sort(Sort).exec(function(err,shoes){
		if(err){
			console.log(err);
			return res.redirect("back");
		}
			res.render("brands/jordan",{shoes: shoes});
		});
	} else{	
		Shoes.find({company: "jordan"},function(err,ps){
			if(err){
				req.flash("error",err.message);
				res.redirect("back");
			} else{
				res.render("brands/jordan",{shoes: ps});
			}
		});
	}	
});

router.get("/reebokshooes",function(req,res){
	if(req.query.high){
		Shoes.find({company: "reebok",
				price: {$gt: req.query.low,$lt: req.query.high},
		    },function(err,shoes){
		if(err){
			console.log(err);
			return res.redirect("back");
		}
		res.render("brands/reebok",{shoes: shoes})
	});
	}else if(req.query.sortby){
		const opt = req.query.sortby.split(":");
		const Sort={};
		Sort[opt[0]] = opt[1] === 'dec' ? -1 : 1;
		Shoes.find({company: "reebok"}).sort(Sort).exec(function(err,shoes){
		if(err){
			console.log(err);
			return res.redirect("back");
		}
			res.render("brands/reebok",{shoes: shoes});
		});
	} else{
		Shoes.find({company: "reebok"},function(err,ps){
			if(err){
				req.flash("error",err.message);
				res.redirect("back");
			} else{
				res.render("brands/reebok",{shoes: ps});
			}
		});
	}
});

router.get("/pumashooes",function(req,res){
	if(req.query.high){
		Shoes.find({company: "puma",
				price: {$gt: req.query.low,$lt: req.query.high},
		    },function(err,shoes){
		if(err){
			console.log(err);
			return res.redirect("back");
		}
		res.render("brands/puma",{shoes: shoes})
	});
	} else if(req.query.sortby){
		const opt = req.query.sortby.split(":");
		const Sort={};
		Sort[opt[0]] = opt[1] === 'dec' ? -1 : 1;
		Shoes.find({company: "puma"}).sort(Sort).exec(function(err,shoes){
		if(err){
			console.log(err);
			return res.redirect("back");
		}
			res.render("brands/puma",{shoes: shoes});
		});
	} else{
	Shoes.find({company: "puma"},function(err,ps){
		if(err){
			req.flash("error",err.message);
			res.redirect("back");
		} else{
			res.render("brands/puma",{shoes: ps});
		}
	});
	}
});

router.get("/batashooes",function(req,res){
	if(req.query.high){
		Shoes.find({company: "bata",
				price: {$gt: req.query.low,$lt: req.query.high},
		    },function(err,shoes){
		if(err){
			console.log(err);
			return res.redirect("back");
		}
		res.render("brands/bata",{shoes: shoes})
	});	
	} else if(req.query.sortby){
		const opt = req.query.sortby.split(":");
		const Sort={};
		Sort[opt[0]] = opt[1] === 'dec' ? -1 : 1;
		Shoes.find({company: "bata"}).sort(Sort).exec(function(err,shoes){
		if(err){
			console.log(err);
			return res.redirect("back");
		}
			res.render("brands/bata",{shoes: shoes});
		});
	} else{
		Shoes.find({company: "bata"},function(err,ps){
			if(err){
				req.flash("error",err.message);
				res.redirect("back");
			} else{
				res.render("brands/bata",{shoes: ps});
			}
		});
	}
});

//category
router.get("/spoorts",function(req,res){
	if(req.query.high){
		Shoes.find({category: "sports",
				price: {$gt: req.query.low,$lt: req.query.high},
		    },function(err,shoes){
		if(err){
			console.log(err);
			return res.redirect("back");
		}
		res.render("category/sports",{shoes: shoes})
	});
	} else if(req.query.sortby){
		const opt = req.query.sortby.split(":");
		const Sort={};
		Sort[opt[0]] = opt[1] === 'dec' ? -1 : 1;
		Shoes.find({category: "sports"}).sort(Sort).exec(function(err,shoes){
		if(err){
			console.log(err);
			return res.redirect("back");
		}
			res.render("category/sports",{shoes: shoes});
		});
	} else{
		Shoes.find({category: "sports"},function(err,ps){
			if(err){
				req.flash("error",err.message);
				res.redirect("back");
			} else{
				res.render("category/sports",{shoes: ps});
			}
		});
	}
});

router.get("/foormals",function(req,res){
	if(req.query.high){
		Shoes.find({category: "formals",
				price: {$gt: req.query.low,$lt: req.query.high},
		    },function(err,shoes){
		if(err){
			console.log(err);
			return res.redirect("back");
		}
		res.render("category/formals",{shoes: shoes})
	});
	} else if(req.query.sortby){
		const opt = req.query.sortby.split(":");
		const Sort={};
		Sort[opt[0]] = opt[1] === 'dec' ? -1 : 1;
		Shoes.find({category: "formals"}).sort(Sort).exec(function(err,shoes){
		if(err){
			console.log(err);
			return res.redirect("back");
		}
			res.render("category/formals",{shoes: shoes});
		});
	} else{
		Shoes.find({category: "formals"},function(err,ps){
			if(err){
				req.flash("error",err.message);
				res.redirect("back");
			} else{
				res.render("category/formals",{shoes: ps});
			}
		});
	}
});

router.get("/loofars",function(req,res){
	if(req.query.high){
		Shoes.find({category: "loafers",
				price: {$gt: req.query.low,$lt: req.query.high},
		    },function(err,shoes){
		if(err){
			console.log(err);
			return res.redirect("back");
		}
		res.render("category/lofars",{shoes: shoes})
	});	
	} else if(req.query.sortby){
		const opt = req.query.sortby.split(":");
		const Sort={};
		Sort[opt[0]] = opt[1] === 'dec' ? -1 : 1;
		Shoes.find({category: "loafers"}).sort(Sort).exec(function(err,shoes){
		if(err){
			console.log(err);
			return res.redirect("back");
		}
			res.render("category/lofars",{shoes: shoes});
		});
	} else{
		Shoes.find({category: "loafers"},function(err,ps){
		if(err){
			req.flash("error",err.message);
			res.redirect("back");
		} else{
			res.render("category/lofars",{shoes: ps});
		}
	});
	}
});

router.get("/highestRated",function(req,res){
	if(req.query.high){
	Shoes.find({rating: {$gt: 4.5},
			price: {$gt: req.query.low,$lt: req.query.high}},function(err,hr){
		if(err){
			req.flash("error","Something went to be wrong!!");
			res.redirect("back");
		} else{
			res.render("home/highestRated",{shoes: hr});
		}
	});
	} else if(req.query.sortby){
		const opt = req.query.sortby.split(":");
		const Sort={};
		Sort[opt[0]] = opt[1] === 'dec' ? -1 : 1;
		Shoes.find({rating: {$gt: 4.5}}).sort(Sort).exec(function(err,hr){
		if(err){
			req.flash("error","Something went to be wrong!!");
			res.redirect("back");
		} else{
			res.render("home/highestRated",{shoes: hr});
		}
	})
	} else{
		Shoes.find({rating: {$gt: 4.5}},function(err,hr){
		if(err){
			req.flash("error","Something went to be wrong!!");
			res.redirect("back");
		} else{
			res.render("home/highestRated",{shoes: hr});
		}
	  })
	}
});

router.get("/sale-discounts",function(req,res){
	if(req.query.high){
	Shoes.find({discount: {$gt: 10},
			price: {$gt: req.query.low,$lt: req.query.high}},function(err,lc){
		if(err){
			req.flash("error","Something went to be wrong!!");
			res.redirect("back");
		} else{
			res.render("home/sale",{shoes: lc});
		}
	})
	} else if(req.query.sortby){
		const opt = req.query.sortby.split(":");
		const Sort={};
		Sort[opt[0]] = opt[1] === 'dec' ? -1 : 1;
		Shoes.find({discount: {$gt: 10}}).sort(Sort).exec(function(err,lc){
		if(err){
			req.flash("error","Something went to be wrong!!");
			res.redirect("back");
		} else{
			res.render("home/sale",{shoes: lc});
		}
	})
	} else{
		Shoes.find({discount: {$gt: 10}},function(err,lc){
		if(err){
			req.flash("error","Something went to be wrong!!");
			res.redirect("back");
		} else{
			res.render("home/sale",{shoes: lc});
		}
	  })
	}
})

router.get("/Trending",function(req,res){
	if(req.query.high){
	Shoes.find({category: "trending",
			price: {$gt: req.query.low,$lt: req.query.high}},function(err,ts){
		if(err){
			req.flash("error","Something went to be wrong!!");
			res.redirect("back");
		} else{
			res.render("home/trending",{shoes: ts});
		}
	})
	} else if(req.query.sortby){
		const opt = req.query.sortby.split(":");
		const Sort={};
		Sort[opt[0]] = opt[1] === 'dec' ? -1 : 1;
		Shoes.find({category: "trending"}).sort(Sort).exec(function(err,ts){
		if(err){
			req.flash("error","Something went to be wrong!!");
			res.redirect("back");
		} else{
			res.render("home/trending",{shoes: ts});
		}
	})
	} else{
		Shoes.find({category: "trending"},function(err,ts){
		if(err){
			req.flash("error","Something went to be wrong!!");
			res.redirect("back");
		} else{
			res.render("home/trending",{shoes: ts});
		}
	  })
	}
});

// Show Page
router.get("/details/:id",function(req,res){
	Shoes.findById(req.params.id).populate({
        path: "reviews",
        options: {sort: {createdAt: -1}} // we can also do chaining of populate.
    }).exec(function(err,fs){
		if(err){
			req.flash('error',err.message);
			res.redirect("back");
		} else{
			res.render("showPage",{s: fs});
		}
	});
});


const calculateDiscount = function(dis,price){
	const newprice = (price - (price*(dis/100)));
	return newprice;
}
module.exports = router;