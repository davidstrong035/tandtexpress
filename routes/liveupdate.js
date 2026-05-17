//Set up
let express = require("express");
let router = express.Router();
const nodemailer = require("nodemailer");
let userModel = require("../schemas/userSchema");
let ms = require("../mailSender");

router.post("/liveupdate", function (req, res) {
  ///console.log(req.body);

  let theUpdate = {
    timePosted: req.body.timePosted,
    Information: req.body.information,
    datePosted: req.body.datePosted,
    location: req.body.location,
  };

  //Update the processing field in the database
  userModel
    .where({ "parcel.tracking": req.body.trackingNumber })
    .update({ $push: { liveUpdate: theUpdate } }, function (err, count) {
      if (err) {
        res
          .status(200)
          .send({ message: "Couldn't update info, please try again" });
        console.log("Couldn't update the parcel");
        console.log(err);
      } else {
        userModel.findOne(
          { "parcel.tracking": req.body.trackingNumber },
          function (err, doc) {
            if (err) console.log(error);
            //console.log("Doc is: " + doc);
            email = doc.receiver.email;
            receiverName = doc.receiver.name;

            ////////////////////////////////////////////////////////

            let from = `T&T Express Delivery <noreply@thetntexps.com>`;
            let receiver = `${email}`;
            let message = `
						<div style="width: 600px; margin: 0 auto; background: #F0F2F5; padding: 20px; height: 900px;">
						    <img src="https://cour.thetntexps.com/assets/images/logo-v2.png" height="50px" />
						    <span style="text-decoration: underline;font-weight: bold;font-size: 15px; margin-left: 30px;"> New Parcel Update </span>
						    <p>
						        Hello ${receiverName},
						    </p>

						    <p>
						        Your package has been updated. Look below for current update.
						    </p>

						    <div style="margin-top: 40px;line-height: 5px;font-size: .9em">
						        <p>
						            Tracking Number: <span style="font-weight: bold"> ${req.body.trackingNumber} </span>
						        </p>
						        <p>
						            Activity: <span style="font-weight: bold"> ${req.body.information} </span>
						        </p>
						        <p>
						            Current Location: <span style="font-weight: bold"> ${req.body.location} </span>
						        </p>
						    </div>

						    <div style="margin-top: 50px;">
						        <p style="font-size: .8em; color: gray">
						            This is an automatically generated email, you can't reply to this email.
						        </p>

						        <div style="font-size: .8em; color: gray">
						            If you need to reach out to us, send us an email on:
						            <ul>
						                <li> Website: www.cour.thetntexps.com
						                <li> Email: info@thetntexps.com
						                <li> Tel: +1 585 308 0030 </li>
						            </ul>
						        </div>

						        <p style="font-size: .8em; color: gray">
						             -- Delivering at the right time every time - Yes, We Deliver --
						        </p>
						    </div>
						</div>
					`;
            subject = `Real Time update of your parcel.`;
            let error = {
              message:
                "Update was successful, but we couldn't send email to the receiver",
            };
            let success = { message: "Update completed successfully." };
            console.log("Update successful.");
            ms.mailSender(
              from,
              receiver,
              subject,
              message,
              error,
              success,
              res,
            );
          },
        );
      }
    });
});

module.exports = router;
