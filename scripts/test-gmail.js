// Test script for Gmail configuration
const nodemailer = require('nodemailer');
require('dotenv').config({ path: '.env.local' });

// Check if Gmail credentials are configured
if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
  console.error('Error: Gmail credentials not configured.');
  console.error('Please set GMAIL_USER and GMAIL_APP_PASSWORD in your .env.local file');
  process.exit(1);
}

// Create Gmail transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD // App password, not your regular Gmail password
  }
});

// Test email options
const mailOptions = {
  from: process.env.GMAIL_USER,
  to: process.env.GMAIL_USER, // Sending to yourself for testing
  subject: 'Tuji Beads Email Test',
  text: 'This is a test email from Tuji Beads application.',
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #f0f0f0; border-radius: 5px;">
      <h1 style="color: #f02d34;">Tuji Beads Email Test</h1>
      <p>This is a test email from your Tuji Beads e-commerce application.</p>
      <p>If you're receiving this email, your Gmail configuration is working correctly!</p>
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #f0f0f0;">
        <p style="font-size: 12px; color: #999;">This is an automated test email. Please do not reply.</p>
      </div>
    </div>
  `
};

// Send test email
console.log('Sending test email...');
transporter.sendMail(mailOptions)
  .then(info => {
    console.log('Email sent successfully!');
    console.log('Message ID:', info.messageId);
    console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
  })
  .catch(error => {
    console.error('Error sending email:', error);
  });
