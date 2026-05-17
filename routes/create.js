//Set up
let express = require("express");
let router = express.Router();

let userModel = require("../schemas/userSchema");
let ms = require("../mailSender");

router.post("/create", function (req, res) {
  //console.log(req.body.shippingDate.slice(1,10));
  let newUser = {
    sender: {
      name: req.body.senderName.trim(),
      address: req.body.senderAddress.trim(),
      country: req.body.senderCountry.trim(),
      tel: req.body.senderPhone,
      email: req.body.senderEmail,
    },
    receiver: {
      name: req.body.receiverName.trim(),
      address: req.body.receiverAddress.trim(),
      country: req.body.receiverCountry.trim(),
      tel: req.body.receiverPhone,
      email: req.body.receiverEmail,
    },
    parcel: {
      tracking: req.body.trackingNumber.trim(),
      packages: [],
    },
    shippinginformation: {
      carrier: req.body.carrier,
      shipmentmode: req.body.shippingMode,
      deliveryduration: req.body.duration.trim(),
      shipmentdate: req.body.shippingDate.slice(0, 10),
      deliverydate: req.body.deliveryDate.slice(0, 10),
    },
    progress: {
      shipped: false,
      transit: false,
      delivered: false,
    },
    liveUpdate: [],
  };

  newUserInstance = new userModel(newUser);

  newUserInstance.save(function (err) {
    if (err) {
      //console.log("Unable to create new tracking, please try again.");
      //console.log(err);
      if (err.code == 11000) {
        res.status(400).send({
          message:
            "This tracking number has been assigned, kindly use another tracking number.",
        });
      } else {
        res.status(400).send({
          message: "An Error Occurred During Creation, please try again",
        });
      }
    } else {
      let from = `T&T Express Delivery <noreply@thetntexps.com>`;
      let receiver = `${req.body.receiverEmail}`;
      let message = `
				<div style="width: 600px; margin: 0 auto; min-height: 600px; background: #F0F2F5; padding: 20px;">
				    <img src="https://cour.thetntexps.com/assets/images/logo-v2.png" height="50px" />
				    <span style="text-decoration: underline;font-weight: bold;font-size: 15px; margin-left: 30px;"> A Package has been sent to You </span>

				    <p>
				        A good day to you ${req.body.receiverName.trim()},
				    </p>

					<p>
						A package has been sent to you and is in process. Kindly check below for the details of the shipment and the tracking number so you can follow the movement of your package in real time.
					</p>

				    <div style="margin-top: 40px;">
				        <p>
				            Tracking Number: <span style="font-weight: bold"> ${req.body.trackingNumber.trim()} </span>
				        </p>
				        <p>
				            Shipment Date: <span style="font-weight: bold"> ${req.body.shippingDate.slice(
                      0,
                      10,
                    )} </span>
				        </p>
				        <p>
				            Delivery Date: <span style="font-weight: bold"> ${req.body.deliveryDate.slice(
                      0,
                      10,
                    )} </span>
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
      subject = `A Package has been initiated in your Name`;
      let error = {
        message:
          "Tracking has been created, but couldn't send an email to the receiver, An Error Occurred while trying to send.",
      };
      let success = { message: "Tracking has been created successfully" };

      console.log("Registration Successful.");
      ms.mailSender(from, receiver, subject, message, error, success, res);
      //res.send({"message": "Tracking has been created successfully, Successful"});
    }
  });
});

module.exports = router;
