# Email Configuration Setup for Feedback System

## Overview
The feedback system uses Gmail to send email notifications when users submit feedback. This guide will help you set up the email functionality.

## Step 1: Create a .env file
Create a `.env` file in the `backend` directory with the following variables:

```env
# Email Configuration
EMAIL=your-gmail-address@gmail.com
EMAIL_PASSWORD=your-gmail-app-password

# Other configurations (if needed)
NODE_ENV=development
PORT=5000
```

## Step 2: Set up Gmail App Password

### For Gmail Users:
1. **Enable 2-Factor Authentication**:
   - Go to your Google Account settings
   - Navigate to Security
   - Enable 2-Step Verification

2. **Generate App Password**:
   - Go to Google Account settings
   - Navigate to Security
   - Under "2-Step Verification", click on "App passwords"
   - Select "Mail" as the app and "Other" as the device
   - Generate the password
   - Copy the 16-character password

3. **Use the App Password**:
   - Use your Gmail address as `EMAIL`
   - Use the generated 16-character app password as `EMAIL_PASSWORD`

## Step 3: Test the Configuration

1. Start your backend server
2. Submit a test feedback through the form
3. Check the server console for any error messages
4. Check your Gmail inbox for the feedback email

## Troubleshooting

### Common Issues:

1. **"Email authentication failed"**:
   - Make sure you're using an App Password, not your regular Gmail password
   - Ensure 2-Factor Authentication is enabled

2. **"Unable to connect to email server"**:
   - Check your internet connection
   - Verify Gmail SMTP settings

3. **"Email server connection timed out"**:
   - Check firewall settings
   - Try again later

### Development Mode:
If you don't want to set up email during development, the system will:
- Log feedback to the console
- Return a success message to the user
- Not send actual emails

## Security Notes:
- Never commit your `.env` file to version control
- Use App Passwords instead of your main Gmail password
- Keep your App Password secure

## Alternative Email Providers:
To use other email providers, modify the transporter configuration in `routes/feedback.route.js`:

```javascript
const transporter = nodemailer.createTransport({
  host: 'smtp.your-provider.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD
  }
});
``` 