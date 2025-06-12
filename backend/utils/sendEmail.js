const nodemailer = require('nodemailer');

const sendVerificationEmail = async (to, code) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD // Use App Password (not your real password)
        }
    });

    const mailOptions = {
        from: 'sajadnooribayany2@gmail.com',
        to,
        subject: 'Verify your email',
        html: `<h3>Your verification code is: <b>${code}</b></h3>`
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendVerificationEmail;
