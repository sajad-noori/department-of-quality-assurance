const nodemailer = require('nodemailer');

// Enhanced email service for announcements
const sendEmail = async (emailOptions) => {
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
            to: emailOptions.to,
            subject: emailOptions.subject,
            html: emailOptions.html,
            attachments: emailOptions.attachments || []
        };

        console.log('Attempting to send email to:', emailOptions.to);
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.messageId);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

// Send announcement email with attachment support
const sendAnnouncementEmail = async (recipient, announcement, attachmentPath = null) => {
    const emailOptions = {
        to: recipient.email,
        subject: announcement.title,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333;">${announcement.title}</h2>
                <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
                    ${announcement.content.replace(/\n/g, '<br>')}
                </div>
                <p style="color: #666; font-size: 12px;">
                    This announcement was sent by the system administrator.
                </p>
            </div>
        `,
        attachments: attachmentPath ? [{
            filename: require('path').basename(attachmentPath),
            path: attachmentPath
        }] : []
    };

    return sendEmail(emailOptions);
};

module.exports = {
    sendEmail,
    sendAnnouncementEmail
}; 