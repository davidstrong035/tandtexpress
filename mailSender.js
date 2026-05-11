const nodemailer = require("nodemailer");

const sendMail = (transporter, mailOptions, success) => {
  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      if (success === "token") {
      } else {
        console.log("(Confirmation) Message Sent");
        resolve(true);
      }
      //console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    });
  });
};

module.exports.mailSender = (
  from,
  receiver,
  subject,
  message,
  error,
  success,
  res,
) => {
  let transporter = nodemailer.createTransport({
    host: "mail.tandtxpress.com",
    secureConnection: true,
    tls: {
      rejectUnauthorized: false,
    },
    port: 465,
    auth: {
      user: "noreply@tandtxpress.com", // Generated eheereal User
      pass: "BTt9]0;g1t4IlN", // Generated etheral pass
    },
  });

  let mailOptions = {
    from: from,
    to: receiver,
    subject: subject,
    html: message,
  };

  sendMail(transporter, mailOptions, success).then(
    (data) => res.status(200).send(success),
    (err) => res.status(400).send(error),
  );

  // Send mail with defined transport object
};
