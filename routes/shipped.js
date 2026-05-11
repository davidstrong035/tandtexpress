//Set up
let express = require("express");
let router = express.Router();
const nodemailer = require("nodemailer");
let userModel = require("../schemas/userSchema");



router.post("/shipped", function(req, res){
	let status = req.body.status;
	if(status){
		status = true;
	} else {
		status = false;
	}

	userModel.find({"parcel.tracking": req.body.tracking})
		.then(data=> {
			if(data.length == 0){
				res.status(400).send({"message": "There's no package with that tracking number."})
			} else {
				//Update the processing field in the database
				userModel.where({"parcel.tracking": req.body.tracking})
					.update({$set: {"progress.shipped": status}}, function(err, count){
						if(err) {
							res.status(400).send({"message": "Couldn't update the Initiated status"});
						} else {
							res.status(200).send({"message": "Your Shipping has been initiated successfully"});
						}
					});
			}
		})
		.catch(err=> res.status(400).send({"message": "There's an issue with the server."}))

})

module.exports = router; 