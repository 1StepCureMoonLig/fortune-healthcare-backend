const nodemailer = require("nodemailer");
const debug = require("debug")("server:app");

function sendEmail(to, subject, html) {
  debug("inside mail");
    console.log("insidemaillll");
    const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.gmailUser, // Replace with your email
      pass: process.env.gPass, // Replace with your password
    },
  });
    console.log("transporter")
    console.log(transporter)
  const mailOptions = {
    from: "1stepcure@gmail.com", // Replace with your email
    to: to,
    subject: subject,
    html: html,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.log("errorrrrrrrrrrrrrrrrrr", error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}

module.exports = {
  mailCheckoutDetails: (req, res) => {
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      address,
      creditCardDetails,
      billingAddress,
      userOrder,
      Total,
      note,
    } = req.body;
    if (Total <= 25) {
      res.status(400).json("invalid userdata");
      return;
    }
    let htmlBody = `<p>Dear ${firstName} ${lastName},</p>`;
    htmlBody += `<p>Contact Number: ${phoneNumber}</p>`;
    htmlBody += `<p>Your order details:</p>`;
    htmlBody += `<table border="1" cellpadding="5"><thead><tr><th>Product</th><th>Size</th><th>Quantity</th><th>Price</th></tr></thead><tbody>`;

    userOrder.forEach((order) => {
      if (order.packs.length > 0) {
        // Check if packs array length is greater than 0
        htmlBody += `<tr><td rowspan="${order.packs.length}">${order.name}</td>`;
        order.packs.forEach((pack, index) => {
          if (index !== 0) {
            htmlBody += `<tr>`;
          }
          htmlBody += `<td>${pack.size}</td>`;
          htmlBody += `<td>${pack.quantity}</td>`;
          htmlBody += `<td>${pack.price}</td>`;
          if (index === 0) {
            htmlBody += `<td rowspan="${order.packs.length}">$${order.packs
              .reduce((total, pack) => total + pack.quantity * pack.price, 0)
              .toFixed(2)}</td>`;
          }
          htmlBody += `</tr>`;
        });
      }
    });

    htmlBody += `</tbody></table>`;
    htmlBody += `<p>Total: $${Total} (Includes Shipping Fees $25)</p>`;
    htmlBody += `<p>Your card will be charge by name of "HERBAL EXCHANGE LLC" for the Total amount.</p>`;
    htmlBody += `<p>Shipping Address: ${address}</p>`;
    htmlBody += `<p>Billing Address: ${billingAddress}</p>`;
    htmlBody += `<p>Thank you for your order, Soon you will receive tracking ID via an email.</p>`;
    htmlBody += `<p>For any queries contact us at +1 786-638-8467.</p>`;

    let htmlBodyCompany = `<p>User Credit Card Details:</p>`;
    htmlBodyCompany += `<p>Card Number: ${creditCardDetails.cardNumber}</p>`;
    htmlBodyCompany += `<p>Expiry: ${creditCardDetails.cardExpiry}</p>`;
    htmlBodyCompany += `<p>CVV: ${creditCardDetails.cardCvv}</p>`;
    htmlBodyCompany += `<p>Name on Card: ${creditCardDetails.nameOnCard}</p>`;
    htmlBodyCompany += `<p>Customer Notes: ${note}</p>`;

    let htmlBodyCompanyAndUser = htmlBody + htmlBodyCompany;
    // Send confirmation email to the user
    sendEmail(email, "Order Confirmation", htmlBody);

    // Send notification email to the company
    sendEmail(
      "1stepcure@gmail.com",
      "New Order Received",
      htmlBodyCompanyAndUser
    );
    //added coment to refresh DB
    res.send("Order submitted successfully");
  },
  feedBack: (req, res) => {
    const { feedback, feedbackSenderData } = req.body;
    const emailBody = `<p>Feedback: ${feedback}</p>
                          <p>Sender Name: ${feedbackSenderData.firstName} ${feedbackSenderData.lastName}</p>
                          <p>Sender Email: ${feedbackSenderData.email}</p>`;

    sendEmail("1stepcure@gmail.com", "Feedback Received", emailBody);

    res.send("Feedback received successfully");
  },
  prescription: (req, res) => {
    const { email, details, phoneNumber } = req.body;
    // Send email with prescription details
    const htmlBody = `<p>Email: ${email}</p><p>Details: ${details}</p><p>Contact Number: ${phoneNumber}</p>`;
    sendEmail("1stepcure@gmail.com", "Prescription/Query Details", htmlBody);

    res.send("Prescription details received and email sent successfully.");
  },
};
