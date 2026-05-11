//Set up
let express = require("express");
let router = express.Router();
const nodemailer = require("nodemailer");
let userModel = require("../schemas/userSchema");

router.delete("/removeTracking/:id", function(req, res){

    console.log("Removing Tracking ...");
	
	//Remove user
	userModel.findByIdAndRemove(req.params.id,  (err, result) => {
		if(err) {
			console.log(err);
			res.status(400).send({"message": "Unable to remove this tracking at the moment please try again."})
		} else {
			res.status(200).send({"message": "Tracking has been removed successfully."}); 
		}
	})
});


module.exports = router;