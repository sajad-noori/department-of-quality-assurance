const nodemailer = require('nodemailer');

// Enhanced email sender with custom subject and body support
const sendEmail = async (to, subject, body) => {
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
            subject,
            html: body
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

// Backward compatibility function for verification emails
const sendVerificationEmail = async (to, code) => {
    const subject = 'تایید ایمیل';
    const body = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
            <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                <h2 style="color: #333; text-align: center; margin-bottom: 30px;">تایید ایمیل</h2>
                <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
                    کد تایید شما:
                </p>
                <div style="background-color: #f0f0f0; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0;">
                    <span style="font-size: 24px; font-weight: bold; color: #007bff; letter-spacing: 5px;">${code}</span>
                </div>
                <p style="color: #666; font-size: 14px; text-align: center;">
                    این کد تا ۱۰ دقیقه معتبر است.
                </p>
            </div>
        </div>
    `;
    
    return sendEmail(to, subject, body);
};

module.exports = sendEmail;
module.exports.sendVerificationEmail = sendVerificationEmail;
