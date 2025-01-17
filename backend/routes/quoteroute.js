const nodemailer = require('nodemailer');
const express = require('express');
const router = express.Router();

// Create a transporter for sending emails using Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USERNAME, // Your Gmail username
    pass: process.env.GMAIL_PASSWORD, // Your Gmail password (use App Password if 2FA is enabled)
  },
});

// Quote route
router.post('/quote', async (req, res) => {
  const { name, phone, email, zip, service, date } = req.body;

  // Validate input
  if (!name || !phone || !email || !zip || !service || !date) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  // Construct the email content
  const mailOptions = {
    from: process.env.GMAIL_USERNAME, // Sender email address (configured in environment variables)
    to: process.env.RECEIVER_EMAIL || process.env.GMAIL_USERNAME, // Receiver email address (can be an environment variable or fallback to sender's email)
    subject: `Free Quote Request from ${name}`,
    text: `
      You have received a new quote request:
      
      Name: ${name}
      Phone: ${phone}
      Email: ${email}
      ZIP Code: ${zip}
      Service: ${service}
      Preferred Date: ${date}
    `,
  };

  try {
    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ', info.response);
    res.status(200).json({ message: 'Quote request sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send quote request. Please try again later.' });
  }
});

module.exports = router;