
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const debug = require("debug")("server:app");

// OAuth2 configuration for Gmail API
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET
);

oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

const gmail = google.gmail({
  version: "v1",
  auth: oauth2Client,
});

// Nodemailer constructs the MIME message; it does NOT use SMTP.
const mailComposer = nodemailer.createTransport({
  streamTransport: true,
  buffer: true,
  newline: "unix",
});

// Escape user-provided values before inserting them into HTML.
function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[char];
  });
}

async function sendEmail(to, subject, html) {
  debug("Sending email through Gmail API");

  const from = process.env.GMAIL_USER;

  if (
    !from ||
    !process.env.GOOGLE_CLIENT_ID ||
    !process.env.GOOGLE_CLIENT_SECRET ||
    !process.env.GOOGLE_REFRESH_TOKEN
  ) {
    throw new Error("Gmail API environment variables are missing");
  }

  // Construct the email without making an SMTP connection.
  const message = await mailComposer.sendMail({
    from,
    to,
    subject,
    html,
  });

  // Gmail API expects a base64url-encoded MIME message.
  const raw = message.message.toString("base64url");

  const result = await gmail.users.messages.send({
    userId: "me",
    requestBody: { raw },
  });

  console.log("Email sent:", result.data.id);
  return result.data;
}

module.exports = {
  mailCheckoutDetails: async (req, res) => {
    try {
      const {
        firstName,
        lastName,
        email,
        phoneNumber,
        address,
        billingAddress,
        userOrder,
        Total,
        note,
      } = req.body;

      const total = Number(Total);

      if (
        !Number.isFinite(total) ||
        total <= 25 ||
        !Array.isArray(userOrder) ||
        !email ||
        !firstName
      ) {
        return res.status(400).json("Invalid userdata");
      }

      let htmlBody = `
        <p>Dear ${escapeHtml(firstName)} ${escapeHtml(lastName)},</p>
        <p>Contact Number: ${escapeHtml(phoneNumber)}</p>
        <p>Your order details:</p>
        <table border="1" cellpadding="5">
          <thead>
            <tr>
              <th>Product</th>
              <th>Size</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
      `;

      for (const order of userOrder) {
        if (!Array.isArray(order.packs) || order.packs.length === 0) {
          continue;
        }

        for (const pack of order.packs) {
          const quantity = Number(pack.quantity);
          const price = Number(pack.price);

          if (
            !Number.isFinite(quantity) ||
            !Number.isFinite(price) ||
            quantity < 0 ||
            price < 0
          ) {
            return res.status(400).json("Invalid order details");
          }

          htmlBody += `
            <tr>
              <td>${escapeHtml(order.name)}</td>
              <td>${escapeHtml(pack.size)}</td>
              <td>${escapeHtml(quantity)}</td>
              <td>$${price.toFixed(2)}</td>
              <td>$${(quantity * price).toFixed(2)}</td>
            </tr>
          `;
        }
      }

      htmlBody += `
          </tbody>
        </table>
        <p>Total: $${total.toFixed(2)} (Includes Shipping Fees $25)</p>
        <p>Your card statement may show
          "HERBAL EXCHANGE LLC" as the merchant descriptor.</p>
        <p>Shipping Address: ${escapeHtml(address)}</p>
        <p>Billing Address: ${escapeHtml(billingAddress)}</p>
        <p>Thank you for your order. You will receive your tracking ID
          by email when available.</p>
        <p>For queries, contact us at +1 786-638-8467.</p>
      `;

      // Do not email card numbers, expiry dates or CVVs.
      const companyHtml = `
        <h3>New Order Received</h3>
        <p>Customer: ${escapeHtml(firstName)} ${escapeHtml(lastName)}</p>
        <p>Email: ${escapeHtml(email)}</p>
        <p>Contact Number: ${escapeHtml(phoneNumber)}</p>
        <p>Customer Notes: ${escapeHtml(note)}</p>
        ${htmlBody}
      `;

      await sendEmail(email, "Order Confirmation", htmlBody);

      await sendEmail(
        process.env.GMAIL_USER,
        "New Order Received",
        companyHtml
      );

      return res.send("Order submitted successfully");
    } catch (error) {
      console.error("Checkout email error:", error.message);
      return res.status(500).json({
        error: "Unable to send order emails",
      });
    }
  },

  feedBack: async (req, res) => {
    try {
      const { feedback, feedbackSenderData } = req.body;

      const emailBody = `
        <p>Feedback: ${escapeHtml(feedback)}</p>
        <p>Sender Name:
          ${escapeHtml(feedbackSenderData?.firstName)}
          ${escapeHtml(feedbackSenderData?.lastName)}
        </p>
        <p>Sender Email: ${escapeHtml(feedbackSenderData?.email)}</p>
      `;

      await sendEmail(
        process.env.GMAIL_USER,
        "Feedback Received",
        emailBody
      );

      return res.send("Feedback received successfully");
    } catch (error) {
      console.error("Feedback email error:", error.message);
      return res.status(500).json({
        error: "Unable to send feedback email",
      });
    }
  },

  prescription: async (req, res) => {
    try {
      const { email, details, phoneNumber } = req.body;

      const htmlBody = `
        <p>Customer Email: ${escapeHtml(email)}</p>
        <p>Details: ${escapeHtml(details)}</p>
        <p>Contact Number: ${escapeHtml(phoneNumber)}</p>
      `;

      await sendEmail(
        process.env.GMAIL_USER,
        "Prescription/Query Details",
        htmlBody
      );

      return res.send("Prescription details received successfully.");
    } catch (error) {
      console.error("Prescription email error:", error.message);
      return res.status(500).json({
        error: "Unable to send prescription email",
      });
    }
  },
};
