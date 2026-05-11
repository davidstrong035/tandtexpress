//Set up
let express = require("express");
let router = express.Router();
const nodemailer = require("nodemailer");
let userModel = require("../schemas/userSchema");


router.post("/parcel", function(req, res){
	//console.log(req.body);
	
	userModel.find({"parcel.tracking": req.body.trackingNumber})
		.then(data=> {
			if(data.length == 0){
				res.status(400).send({"message": "There's no package with that tracking number."})
			} else {
				//Update the processing field in the database
				userModel.where({"parcel.tracking": req.body.trackingNumber})
					.update({$push: {"parcel.packages": req.body.parcel}}, function(err, count){
						if(err) {
							res.status(400).send({"message": "Couldn't update the parcel"});
							console.log("Couldn't update the parcel");
							console.log(err);
						} else {
							res.status(200).send({"message": "Added that parcel to your total parcel"});
						}
					});
			}
		})
		.catch(err=> res.status(400).send({"error": "There's an issue with the server."}))
});


module.exports = router; 