//Set up
let express = require("express");
let router = express.Router();
const nodemailer = require("nodemailer");
let ms = require("../mailSender");

router.post("/contact", function (req, res) {
  try {
    // Assuming the HTML form has these field names
    let {
      form_name,
      company_name,
      form_subject,
      form_phone,
      form_message,
      email,
    } = req.body;
    console.log(req.body);

    // Replace newlines with <br> tags and add margin
    const formattedMessage = form_message.replace(
      /(?:\r\n|\r|\n)/g,
      '<br style="margin: 10px 0;">'
    );

    const emailContent = `
        <div style="width: 600px; margin: 0 auto; background: #F0F2F5; padding: 20px; height: 900px;">
            <p>
                Hi Dan,
            </p>

            <p>
                Received a contact message from ${form_name}
            </p>
            <div style="margin-top: 15px;font-size: .9em">
                <p>
                    Email: <span style="font-weight: bold"> ${email} </span>
                </p>
                <p>
                    Phone Number: <span style="font-weight: bold"> ${form_phone} </span>
                </p>
                 <p>
                    On behalf of: <span style="font-weight: bold"> ${company_name} </span>
                </p>
                <p>
                    Subject: <span style="font-weight: bold"> ${form_subject} </span>
                </p>

                <h6 style="text-decoration: underline"> MESSAGE FROM CLIENT </h6>
                <p style="line-height: 1.5;">
                    ${formattedMessage}
                </p>
            </div>
        </div>
        `;

    ms.mailSender(
      email,
      "info@deliverymancourierservices.com",
      form_subject || "Contact Form Submission",
      emailContent,
      { error: "Couldn't send your message" },
      { success: "Successfully sent your message" },
      res
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while processing your request",
    });
  }
});

module.exports = router;
