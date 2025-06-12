const express = require('express');
const nodemailer = require('nodemailer');
const validator = require('validator');
const router = express.Router();
require('dotenv').config();

router.post('/', async (req, res) => {
  let { firstName, lastName, email, message } = req.body;

  // Trim and sanitize
  firstName = validator.escape(validator.trim(firstName || ''));
  lastName = validator.escape(validator.trim(lastName || ''));
  email = validator.normalizeEmail(email || '');
  message = validator.escape(validator.trim(message || ''));

  // Validate input
  if (
    !firstName || firstName.length < 2 ||
    !lastName || lastName.length < 2 ||
    !email || !validator.isEmail(email) ||
    !message || message.length === 0
  ) {
    return res.status(400).json({
      success: false,
      message: 'Invalid input. Please check all fields and try again.'
    });
  }

  // Setup the transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD // Gmail app password
    }
  });

  const mailOptions = {
    from: email,
    to: process.env.EMAIL,
    subject: 'New Feedback Submission',
    html: `
      <h3>Feedback Received</h3>
      <p><strong>First Name:</strong> ${firstName}</p>
      <p><strong>Last Name:</strong> ${lastName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong><br>${message}</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'Feedback sent!' });
  } catch (error) {
    console.error('Email sending error:', error);
    res.status(500).json({ success: false, message: 'Error sending email.' });
  }
});

module.exports = router;
