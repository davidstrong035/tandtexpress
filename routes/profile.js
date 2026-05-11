//Set up
let express = require("express");
let router = express.Router();

let userModel = require("../schemas/userSchema");


const { trim } = require('express-validator').validator;

router.get("/profile/:tracking", function(req, res){  
	
	let trackingNumber = req.params.tracking;
	console.log(trackingNumber);
	userModel.find({"parcel.tracking": trackingNumber})
		.then(data=> {
			if(data.length == 0){
				res.send({"error": "There's no package with that tracking number."})
			} else {
				res.send(data);
			}
		})
		.catch(err=> res.send({"error": "There's an issue with the server."}))
});



module.exports = router;