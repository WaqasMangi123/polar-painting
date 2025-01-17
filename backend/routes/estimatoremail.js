const express = require('express');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const router = express.Router();

// Use Express's built-in JSON parsing middleware
router.use(express.json());

// Set up Nodemailer transporter using Gmail credentials from .env
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USERNAME, // Your Gmail address from .env
    pass: process.env.GMAIL_PASSWORD, // Your Gmail password from .env (use App Password if 2FA enabled)
  },
});

// Route to handle the cost estimator email submission
router.post('/send-estimate', async (req, res) => {
  const { name, email, phone, postalCode, estimate } = req.body;

  // Validation: Ensure all fields are present
  if (!name || !email || !phone || !postalCode || !estimate) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Corrected regex
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format.' });
  }

  // Validate phone format (10-15 digits)
  const phoneRegex = /^\d{10,15}$/;
  if (!phoneRegex.test(phone)) {
    return res.status(400).json({ error: 'Phone number must be between 10-15 digits.' });
  }

  // Prepare email content
  const mailOptions = {
    from: process.env.GMAIL_USERNAME, // Sender email (your Gmail)
    to: process.env.RECEIVER_EMAIL, // Recipient email from .env
    subject: 'New Painting Estimate Received',
    text: `
      Hello Admin,

      A new painting estimate request has been submitted. Here are the details:

      Name: ${name}
      Email: ${email}
      Phone: ${phone}
      Postal Code: ${postalCode}
      Total Estimate: $${estimate}

      Please follow up with the customer promptly.

      Best regards,
      The Polar Painting Company System
    `,
  };

  try {
    // Send email using Nodemailer
    const info = await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: 'Estimate email sent successfully to admin!', info });
  } catch (error) {
    console.error('Error sending email:', error);

    return res.status(500).json({ error: 'Failed to send the estimate email. Please try again later.' });
  }
});

module.exports = router;
