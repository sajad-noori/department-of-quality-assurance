const nodemailer = require('nodemailer');

const sendVerificationEmail = async (to, code) => {
    try {
        if (!process.env.EMAIL || !process.env.EMAIL_PASSWORD) {
            throw new Error('Email configuration is missing');
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        const mailOptions = {
            from: process.env.EMAIL,
            to,
            subject: 'Verify your email',
            html: `<h3>Your verification code is: <b>${code}</b></h3>`
        };

        console.log('Attempting to send email to:', to);
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.messageId);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

module.exports = sendVerificationEmail;
