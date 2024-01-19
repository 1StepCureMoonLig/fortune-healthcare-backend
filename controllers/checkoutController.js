const nodemailer = require('nodemailer');

function sendEmail(to, subject, body) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.COMPANY_EMAIL_ID,
            pass: process.env.COMPANY_EMAIL_PASSWORD,
        },
    });

    const mailOptions = {
        from: process.env.COMPANY_EMAIL_ID,
        to: to,
        subject: subject,
        text: body,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

module.exports = {
    mailCheckoutDetails: (req, res) => {
        const { userName, userEmail, product, quantity } = req.body;

        sendEmail(userEmail, 'Order Confirmation', `Dear ${userName}, Your order for ${quantity} ${product}(s) has been submitted successfully.`);

        sendEmail(process.env.COMPANY_EMAIL_ID, 'New Order Received', `New order received:\nUser: ${userName}\nEmail: ${userEmail}\nProduct: ${product}\nQuantity: ${quantity}`);

        res.send('Order submitted successfully');
    },
    temp: (req, res) => {
        res.send("hii")
    }
}