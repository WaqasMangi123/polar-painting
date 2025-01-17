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
    pass: process.env.GMAIL_PASSWORD, // Your Gmail app password from .env
  },
});

// Route to handle contact form submission
router.post('/contact', async (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  // Validate input fields
  if (!name || !email || !phone || !subject || !message) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  // Validate email format
  const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format.' });
  }

  // Validate phone number format (10-15 digits)
  const phoneRegex = /^\d{10,15}$/;
  if (!phoneRegex.test(phone)) {
    return res.status(400).json({ error: 'Phone number must be between 10-15 digits.' });
  }

  // Construct email content
  const mailOptions = {
    from: process.env.GMAIL_USERNAME, // Sender email address (configured in environment variables)
    to: process.env.RECEIVER_EMAIL, // Explicitly use RECEIVER_EMAIL from .env
    subject: `Contact Form Submission: ${subject}`,
    text: `
      You have received a new message from your website contact form:

      Name: ${name}
      Email: ${email}
      Phone: ${phone}
      Subject: ${subject}

      Message:
      ${message}
    `,
  };

  try {
    // Log recipient email for debugging
    console.log('Sending email to:', process.env.RECEIVER_EMAIL);

    // Send email
    const info = await transporter.sendMail(mailOptions);

    // Log success details
    console.log('Email sent successfully:', info);

    // Return success response
    return res.status(200).json({
      message: `Thank you, ${name}! Your message has been sent successfully. We will get back to you shortly.`,
      info,
    });
  } catch (error) {
    console.error('Error sending email:', error);

    // Specific error messages for common issues
    if (error.responseCode === 535) {
      return res.status(500).json({ error: 'Authentication failed. Please check your Gmail credentials.' });
    } else if (error.responseCode === 550) {
      return res.status(500).json({ error: 'Email delivery failed. Please verify the recipient email address.' });
    }

    // General error message for other issues
    return res.status(500).json({ error: 'Failed to send the message. Please try again later.' });
  }
});

module.exports = router;