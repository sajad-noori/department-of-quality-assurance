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

  // Check if email configuration is set up
  if (!process.env.EMAIL || !process.env.EMAIL_PASSWORD) {
    console.error('Email configuration missing. Please set up EMAIL and EMAIL_PASSWORD in .env file');
    
    // For development/testing, we can still return success but log the feedback
    console.log('=== FEEDBACK RECEIVED (Email not configured) ===');
    console.log('First Name:', firstName);
    console.log('Last Name:', lastName);
    console.log('Email:', email);
    console.log('Message:', message);
    console.log('===============================================');
    
    return res.status(200).json({ 
      success: true, 
      message: 'Feedback received! (Email notification not configured)' 
    });
  }

  try {
    // Setup the transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD // Gmail app password
      }
    });

    const mailOptions = {
      from: process.env.EMAIL, // Use configured email as sender
      to: process.env.EMAIL,   // Send to the same configured email
      subject: 'New Feedback Submission',
      html: `
        <h3>Feedback Received</h3>
        <p><strong>First Name:</strong> ${firstName}</p>
        <p><strong>Last Name:</strong> ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong><br>${message.replace(/\n/g, '<br>')}</p>
        <hr>
        <p><small>Received on: ${new Date().toLocaleString()}</small></p>
      `
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'Feedback sent successfully!' });
  } catch (error) {
    console.error('Email sending error:', error);
    
    // Provide more specific error messages
    let errorMessage = 'Error sending email.';
    
    if (error.code === 'EAUTH') {
      errorMessage = 'Email authentication failed. Please check email credentials.';
    } else if (error.code === 'ECONNECTION') {
      errorMessage = 'Unable to connect to email server.';
    } else if (error.code === 'ETIMEDOUT') {
      errorMessage = 'Email server connection timed out.';
    }
    
    res.status(500).json({ 
      success: false, 
      message: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;
